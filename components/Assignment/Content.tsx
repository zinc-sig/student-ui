import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDropzone } from "react-dropzone";
import { useZinc } from "../../contexts/zinc";
import { Submission } from "../Submission";
import { SubmissionCollectionStatus } from "../SubmissionCollectionStatus";
import { useLayoutDispatch } from "../../contexts/layout";
import { useSubscription } from "@apollo/client";
import { SUBMISSION_SUBSCRIPTION } from "../../graphql/queries/user";
import { SubmissionLoader } from "../SubmissionLoader";
// import { Notification, SubmissionNotification } from "../Notification";
import toast from "react-hot-toast";
import { useMutation} from "@apollo/client";
import { UPDATE_SUBMISSION_NOTI } from "../../graphql/mutations/user";

function AssignmentSubmission({ submissionClosed, configId, isOpen }) {
  const { user ,submitFile } = useZinc();
  // const [updateSubmissionNoti] = useMutation(UPDATE_SUBMISSION_NOTI)
  const dispatch = useLayoutDispatch();
  const onDrop = useCallback(files => {
    if(files.length===0) {
      dispatch({ type: 'showNotification', payload: { title: 'Invalid file type', message: 'Your submission contains file that are not supported, please try again', success: false } });
    } else {
      submitFile(files).then(async ({status, id}: any) => {
        if(status==='success') {
          // start 
          // console.log(id)
          //add data in database
          // const notiConfigUpdateResult = await updateSubmissionNoti({
          //   variables: {
          //     userId: user,
          //     submissionId: id,
          //     submissionIdForCheck: id
          //   }
          // })
          // console.log(notiConfigUpdateResult)
          // subscribe to topic (s-userid-submissionId)
          // get registrationToken of recevier
          // const notiRes = await fetch(`/api/notification/getNotification?&id=${user}`,{
          //   method: 'GET'
          // });
          // const noti = await notiRes.json()
          // const token = noti.notification

          // const response = await fetch(`/api/notification/subscription/${'s'+user.toString()+'-'+id.toString()}`,{
          //   method: 'POST',
          //   body: JSON.stringify({
          //     registrationToken: token,
          //     userId: id
          //   })
          // })
          // end

          // if success
          dispatch({ type: 'showNotification', payload: { title: 'Submission upload completed', message: 'Your work has been submitted successfully.', success: true } });
        }
      }).catch(error => {
        dispatch({ type: 'showNotification', payload: { title: 'Submission failed', message: error.message, success: false } });
      })
    }
  }, [configId])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: '.h,.cpp,.rar,.zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed' });


  if (submissionClosed) {
    return (
      <div className="rounded-lg bg-gray-200 w-full py-4 flex flex-col items-center justify-center">
        <FontAwesomeIcon className="text-gray-500" icon={['fad', 'calendar-exclamation']} size="3x"/>
        <h4 className="mt-4 font-medium text-gray-500">Submission Deadline has passed</h4>
        <p className="text-sm text-gray-400">No new submission is allowed after the submission deadline is due</p>
      </div>
    )
  }
  else if (!isOpen) {
    return (
      <div className="rounded-lg bg-gray-200 w-full py-4 flex flex-col items-center justify-center">
        <FontAwesomeIcon className="text-gray-500" icon={['fad', 'calendar-exclamation']} size="3x"/>
        <h4 className="mt-4 font-medium text-gray-500">Submission not available</h4>
        <p className="text-sm text-gray-400">Your instructor has not made this assignment available for submission yet</p>
      </div>
    )
  } else {
    return (
      <div {...getRootProps()} className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 focus:outline-none w-full ${isDragActive?'border-blue-400':'border-gray-300'} border-dashed rounded-md`}>
        <div className="text-center">
        <FontAwesomeIcon icon={['fad', 'upload']} size="2x" />
          <p className="mt-1 text-sm text-gray-600">
            <input {...getInputProps()}/>
            <button className="mr-1 font-medium text-cse-600 hover:text-cse-500 focus:outline-none focus:underline transition duration-150 ease-in-out">
              Upload a file
            </button>
            or drag and drop
          </p>
          <p className="mt-1 text-xs text-gray-500">
            ZIP file up to 10MB
          </p>
        </div>
      </div>
    )
  }
}

export function AssignmentContent({ content }) {
  const assignmentCreatedDate = new Date(content.createdAt);
  assignmentCreatedDate.setTime(assignmentCreatedDate.getTime()+8*60*60*1000);
  const { user } = useZinc();
  const { data, error ,loading } = useSubscription(SUBMISSION_SUBSCRIPTION, {
    variables: {
      userId: user,
      assignmentConfigId: content.id
    }
  })
  // console.log(error)
  return (
    <div className="flex-1 overflow-y-auto">
      <div>
        {/* <div className="flex items-center justify-between py-4 px-6 bg-gray-100">
          <div className="flex items-center space-x-6">
            <Link href={content.assignment.course.website}>
              <a
                target="_blank"
                aria-label="Visit Course Website"
                data-flow="right"
                className="h-10 w-10 flex justify-center items-center rounded-full text-gray-500 hover:text-gray-600 focus:bg-gray-300 focus:outline-none transition duration-150 ease-in-out">
                <label htmlFor="download" className="sr-only">Visit Course Website</label>
                <FontAwesomeIcon icon={['fad', 'browser']} size="lg"/>
              </a>
            </Link>
            <button
              aria-label="View Teaching Staff"
              data-flow="right"
              className="h-10 w-10 flex justify-center items-center rounded-full text-gray-500 hover:text-gray-600 focus:bg-gray-300 focus:outline-none transition duration-150 ease-in-out">
              <label htmlFor="download" className="sr-only">View Teaching Staffs</label>
              <FontAwesomeIcon icon={['fad', 'users']} size="lg"/>
            </button>
            <button className="h-10 w-10 flex justify-center items-center rounded-full text-gray-500 hover:text-gray-600 focus:bg-gray-300 focus:outline-none transition duration-150 ease-in-out">
              <label htmlFor="download" className="sr-only">List of files</label>
              <FontAwesomeIcon icon={['fad', 'folder-tree']} size="lg"/>
            </button>
            <button 
              aria-label="Download Skeleton Code"
              data-flow="right"
              className="h-10 w-10 flex justify-center items-center rounded-full text-gray-500 hover:text-gray-600 focus:bg-gray-300 focus:outline-none transition duration-150 ease-in-out">
              <label htmlFor="download" className="sr-only">Download Skeleton Code</label>
              <FontAwesomeIcon icon={['fad', 'folder-download']} size="lg"/>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex justify-center items-center text-gray-500 w-8 h-8 rounded-full focus:bg-gray-300 focus:outline-none hover:text-gray-600 transition duration-150 ease-in-out">
              <label htmlFor="download" className="sr-only">Download Skeleton Code</label>
              <FontAwesomeIcon icon={['far', 'angle-up']} size="lg"/>
            </button>
            <button className="flex justify-center items-center text-gray-500 w-8 h-8 rounded-full focus:bg-gray-300 focus:outline-none hover:text-gray-600 transition duration-150 ease-in-out">
              <label htmlFor="download" className="sr-only">Download Skeleton Code</label>
              <FontAwesomeIcon icon={['far', 'angle-down']} size="lg"/>
            </button>
          </div>
        </div> */}
        <ul className="my-6">
          <li>
            <div className="flex flex-col items-center p-6 border bg-white mt-5 mx-5 rounded-lg overflow-y-scroll">
              <div className="flex w-full justify-between">
                <h1 className="text-lg font-light leading-5">{content.assignment.name}</h1>
                <span className="text-gray-400 text-sm">Released on {assignmentCreatedDate.toDateString()}</span>
              </div>
              <div className="mt-4 w-full">
                <SubmissionCollectionStatus
                  closed={content.submissionWindowPassed}
                  dueAt={content.dueAt}
                />
              </div>
              <p className="my-4 leading-4">
                { content.assignment.description }
              </p>
              <AssignmentSubmission
                configId={content.id}
                submissionClosed={content.submissionWindowPassed}
                isOpen={content.openForSubmission}
                />
            </div>
          </li>
          { loading && <SubmissionLoader/> }
          {
            !loading && data.submissions.map(submission => (
              <Submission key={submission.id} submission={submission} />
            ))
          }
        </ul>
      </div>
    </div>
  );
}