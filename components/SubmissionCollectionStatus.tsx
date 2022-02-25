import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function SubmissionCollectionStatus({ closed, dueAt }) {
  const dueDate = new Date(`${dueAt.split('T')[0]} ${(dueAt).split('T')[1].split('.')[0]} UTC`);
  const now = new Date();
  if (closed) {
    return (
      <span className={`px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium`}>
        <FontAwesomeIcon className="mr-2" icon={['fad', 'box']}/>
        Closed
      </span>
    )
  } else if (dueDate < now) {
    return (
      <span className={`px-4 py-1.5 rounded-full bg-yellow-400 text-white text-sm font-medium`}>
        <FontAwesomeIcon className="mr-2" icon={['fad', 'alarm-exclamation']}/>
        Late
      </span>
    )
  } else {
    return (
      <span className={`px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium`}>
        <FontAwesomeIcon className="mr-2" icon={['fad', 'box-open']} />
        Open
      </span>
    )
  }
}