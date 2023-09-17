import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Report } from "./Report/index";

export function Submission({ submission }) {
  const now = new Date();
  
  const submittedDate = new Date(submission.created_at);
  return (
    <li >
      <ul>
        {
          submission.reports.map(report => (
            <Report key={report.id} report={report}/>
          ))
        }
      </ul>
      {
        (submission.fail_reason || submission.extracted_path === null) && (
          <>
            <div className="mx-12 h-12 border-l-2"></div>
            <div className="mx-8 flex justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex justify-center items-center">
                  <FontAwesomeIcon className="text-white" icon={['fad', 'file-archive']}/>
                </div>
                <p className="ml-2 text-sm text-gray-600 flex flex-col">
                  Error occurred during decompression for the submitted archive
                  <span className="text-xs font-medium">Reason: {
                    submission.fail_reason??'Possible data corruption detected, decompressor failed to process the archive'
                  }</span>
                </p>
              </div>
            </div>
          </>
        )
      }
      <div className="mx-12 h-12 border-l-2"></div>
      <div className="mx-8 flex justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex justify-center items-center" data-flow="up" aria-label={`#${submission.id}`}>
            <FontAwesomeIcon icon={['fad', 'folder-upload']}/>
          </div>
          <p className="ml-2 text-sm text-gray-600">
            You submitted on 
            <span className="ml-1">
              { `${submittedDate.toLocaleDateString('en-HK',{ month: 'short', day: 'numeric', ...(submittedDate.getFullYear()!==now.getFullYear()&&{ year: 'numeric' }) })} at ${submittedDate.toLocaleTimeString().toLowerCase()}` }
            </span>
          </p>
        </div>
        <span className="inline-flex rounded-md shadow-sm">
          <Link href={`/api/submissions/${submission.id}`}>
            <a className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded-lg text-blue-700 bg-white hover:text-blue-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-blue-800 active:bg-gray-50 transition ease-in-out duration-150">
              Download
            </a>
          </Link>
        </span>
      </div>
    </li>
  )
}
