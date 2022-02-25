import { copyFile, statSync, readFileSync } from "fs";
import formidable from "formidable-serverless";
import AdmZip from "adm-zip";
import { parse } from "cookie";
import axios from "axios";
import sha256File from "sha256-file";

interface Submission {
  stored_name: string
  upload_name: string
  extracted_path?: string
  checksum: string
  fail_reason?: string
  remarks?: string[]
  size: number,
  assignment_config_id: number
  user_id: number
}

async function submit(cookie: string, submission: Submission) {
  console.log("inside submission api")

  try {
    const { data: { data } } = await axios({
      method: 'post',
      headers: {
        cookie
      },
      url: process.env.API_URL,
      data: {
        query: `
          mutation addSubmissionEntry($submission: submissions_insert_input!) {
            createSubmission(
              object: $submission
            ){ id }
          }
        `,
        variables: { submission }
      },
    });
    console.log(data)
    return data.createSubmission;
  } catch (error) {
    throw error;
  }
}

export default async function (req, res) {
  try {
    const { user } = parse(req.headers.cookie)
    const form = new formidable.IncomingForm({
      multiples: true,
      hash: 'sha256',
      keepExtensions: true,
      encoding: 'utf-8'
    });
    form.parse(req, async (err, fields, { files }) => {
      if(err) {
        throw err;
      } else {
        if(Array.isArray(files)) {
          console.log('A')
          if(files.filter(({ name, hash }) => hash!==fields[`checksum;${name}`]).length > 1) {
            throw new Error('One or more checksum mismatched, potential transmission corruption detected');
          }
          const zip = new AdmZip();
          for (const file of files) {
            zip.addFile(file.name, readFileSync(file.path));
          }
          const filename = `${Date.now()}_${user}_aggregated.zip`
          const destinationFilename = `submitted/${filename}`;
          const savedPath = `${process.env.UPLOAD_DIR}/${destinationFilename}`
          zip.writeZip(savedPath);
          const { size } = statSync(savedPath);
          const submission: Submission = {
            stored_name: destinationFilename,
            upload_name: filename,
            assignment_config_id: parseInt(fields.assignmentConfigId, 10),
            size,
            checksum: sha256File(savedPath),
            user_id: parseInt(user, 10)
          }
          await submit(req.headers.cookie, submission);
          res.json({
            status: 'success'
          });
        } else {
          console.log('B')
          if(files.hash!==fields[`checksum;${files.name}`]) {
            return res.status(500).json({
              status: 'error',
              error: 'Checksum mismatched, potential transmission corruption detected'
            });
          }
          const destinationFilename = `submitted/${files.lastModifiedDate.getTime()}_${user}_${files.path.replace(`/tmp/`, '')}`
          console.log(destinationFilename)
          const submission: Submission = {
            stored_name: destinationFilename,
            upload_name: files.name,
            assignment_config_id: parseInt(fields.assignmentConfigId, 10),
            size: files.size,
            checksum: files.hash,
            user_id: parseInt(user, 10)
          }
          try {
            copyFile(files.path, `${process.env.UPLOAD_DIR}/${destinationFilename}`, async (err) => {
              if(!err) {
                const {id} = await submit(req.headers.cookie, submission);
                return res.json({
                  status: 'success',
                  id
                });
              }
            });
          } catch (error) {
            if (error.message.includes(`Cannot read property 'createSubmission' of undefined`)) {

              return res.status(403).json({
                status: 'error',
                error: 'Timeline misalignment for requested submission'
              })
            }
            else {
              return res.status(500).json({
                status: 'error',
                error: error.message
              });
            }
          }
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: error.message
    })
  }
}

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false
  }
}