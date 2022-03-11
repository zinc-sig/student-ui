import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useZinc } from "../../contexts/zinc";
import { GET_ASSIGNMENTS } from "../../graphql/queries/user";

function AssignmentListItem({ assignmentConfig }) {
  const { assignment, id, showAt, createdAt, dueAt, attemptLimits } = assignmentConfig;
  const releaseDate = new Date(showAt??createdAt);
  releaseDate.setTime(releaseDate.getTime()+8*60*60*1000);
  const dueDate = new Date(dueAt);
  dueDate.setTime(dueDate.getTime()+8*60*60*1000);
  const router = useRouter();
  const { assignmentId } = router.query;
  const assignmentColor = {
    'LAB': 'bg-teal-200 text-teal-800',
    'PA': 'bg-blue-200 text-blue-800',
    'GP': 'bg-indigo-200 text-indigo-800'
  }

  return (
    <Link href="/assignments/[assignmentId]" as={`/assignments/${id}`}>
      <a className={`space-y-1 px-6 py-3 block ${assignmentId==id?'bg-blue-100 border-l-4 border-cse-300':'bg-white'}`}>
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-gray-900">{ assignment.course.code }</span>
          <span className="text-sm text-gray-600">
            { releaseDate.toLocaleDateString('en-HK',{ year: 'numeric', month: 'short', day: 'numeric'}) }
          </span>
        </div>
        <p className="text-sm text-gray-900">
          <span className={`mr-2 inline-flex items-center w-10 justify-center px-2 py-0.5 rounded-md text-xs font-semibold leading-5 ${assignmentColor[assignment.workloadType.name]}`}>
            { assignment.workloadType.name }
          </span>
          { assignment.name }
        </p>
        <p className="text-sm text-gray-500 flex justify-start">
          <span className="w-8">
            <FontAwesomeIcon icon={['fad', 'calendar-exclamation']} size="lg"/>
          </span>
          <span>Due on { dueDate.toLocaleDateString('en-HK') } at { dueDate.toLocaleTimeString() }</span>
        </p>
        <p className="text-sm text-gray-500 flex justify-start">
          <span className="w-8">
            <FontAwesomeIcon icon={['fad', 'redo-alt']} size="lg"/>
          </span>
          <span>{ attemptLimits===null?'No Retry Limit': `Retry Limit: ${attemptLimits} times` }</span>
        </p>
      </a>
    </Link>
  );
}

export function Assignments() {
  const { visibleCourses, user } = useZinc();
  const { data, error ,loading } = useQuery(GET_ASSIGNMENTS, {
    variables: {
      userId: user,
      courseIds: visibleCourses
    }
  });
  return (
    <div className="flex-1 overflow-y-auto">
      {
        !loading && data.user.assignedTasks.map(( { assignment_config: config }) => (
          <div className="border-b" key={config.id}>
            <AssignmentListItem assignmentConfig={config}/>
          </div>
        ))
      }
    </div>
  );
}

export function AssignmentSection() {
  return (
    <section className="flex flex-col w-full md:max-w-xs max-w-full flex-grow border-r border-l">
      <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between border-b">
        <button className="flex items-center text-xs font-semibold text-gray-600 focus:outline-none">
          Sorted by Date
          <svg className="ml-auto h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
        <button>
          <FontAwesomeIcon className="h-6 w-6 text-gray-500" icon={['fad', 'sort-amount-up']} size="1x"/>
        </button>
      </div>
      <Assignments/>
    </section>
  );
}