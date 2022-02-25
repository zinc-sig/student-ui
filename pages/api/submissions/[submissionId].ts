import axios from "axios";

export default async function (req, res) {
  try {
    const { submissionId } = req.query;
    const { data: { data } } = await axios({
      method: 'post',
      headers: {
        cookie: req.headers.cookie
      },
      url: `https://${process.env.API_URL}/v1/graphql`,
      data: {
        query: `
          query getSubmission($id: bigint!) {
            submission(
              id: $id
            ){
              stored_name
              upload_name
              created_at
            }
          }
        `,
        variables: { id: submissionId }
      },
    });
    const { stored_name, upload_name, created_at } = data.submission;
    res.download(`${process.env.NEXT_PUBLIC_UPLOAD_DIR}/`+stored_name, `${(new Date(created_at)).getTime()}_${upload_name}`)
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}

export const config = {
  api: {
    externalResolver: true
  }
}