import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { LayoutProvider } from "../contexts/layout";
import { Layout } from "../layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useZinc } from "../contexts/zinc"
import { initializeApollo } from "../lib/apollo";
import { GET_SEMESTERS } from "../graphql/queries/user";
import { Dropdown, useDropdown } from "../components/Dropdown";

function AssignmentListItem({ assignmentConfig }) {
  const { assignment, id, showAt, createdAt } = assignmentConfig;
  const router = useRouter();
  const { assignmentId } = router.query;

  return (
    <Link href="/assignments/[assignmentId]" as={`/assignments/${id}`}>
      <a className={`px-6 py-3 block ${assignmentId==id?'bg-blue-100 border-l-4 border-cse-300':'bg-white'}`}>
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-gray-900">{ assignment.course.code }</span>
          <span className="text-sm text-gray-600">
            { (new Date(showAt??createdAt)).toLocaleDateString('en-US',{ year: 'numeric', month: 'short', day: 'numeric'}) }
          </span>
        </div>
        <p className="text-sm text-gray-900">
          <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold leading-5 bg-blue-200 text-blue-800">
            PA1
          </span>
          { assignment.name }
        </p>
        <p
          className="text-sm text-gray-500">
            During this time of Covid-19 pandemic, many people including nurses, doctors, engineers, and scientists, all want to...</p>
      </a>
    </Link>
  );
}

export function Assignments() {
  const { visibleCourses } = useZinc();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b">
        <a className="px-6 py-3 block bg-white">
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-gray-900">COMP2012H</span>
            <span className="text-sm text-gray-600">Jul 14, 2020</span>
          </div>
          <p className="text-sm text-gray-900">
            <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold leading-5 bg-blue-100 text-blue-800">
              PA1
            </span>
            Infection Analyzer
          </p>
          <p
            className="text-sm text-gray-400">
              During this time of Covid-19 pandemic, many people including nurses, doctors, engineers, and scientists, all want to...</p>
        </a>
      </div>
      <a className="px-6 py-3 block bg-white">
        <div className="flex justify-between">
          <span className="flex items-center">
            <div className="mr-2 w-2.5 h-2.5 flex-shrink-0 rounded-full bg-pink-600"></div>
            <span className="text-sm font-semibold text-gray-900">COMP1022P</span>
          </span>
          <span className="text-sm text-gray-600">Jul 14, 2020</span>
        </div>
        <p className="text-sm text-gray-900">
          <span className="mr-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold leading-5 bg-teal-100 text-teal-800">
            LAB2
          </span>
          Infection Analyzer
        </p>
        <p
          className="text-sm text-gray-400">
            During this time of Covid-19 pandemic, many people including nurses, doctors, engineers, and scientists, all want to...</p>
      </a>
    </div>
  );
}

function SemesterSelection() {
  const { toggleDropdown, display } = useDropdown();
  const { data, loading } = useQuery(GET_SEMESTERS);
  
  return (
    <button
      onClick={() => toggleDropdown()}
      className="flex items-center text-xs font-semibold text-gray-600 focus:outline-none">
      { !loading && data.semesters[0].name}
      <svg className="ml-auto h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
      </svg>
    </button>
  )
}

export function AssignmentSection() {
  const { data, loading } = useQuery(GET_SEMESTERS);
  return (
    <section className="flex flex-col w-full md:max-w-xs max-w-full flex-grow border-r border-l">
      <div className="flex-shrink-0 px-4 py-2 flex items-center justify-between border-b">
        <Dropdown
          className="z-10 mx-3 origin-top absolute right-0 left-1 mt-2 rounded-md shadow-lg w-56"
          trigger={<SemesterSelection/>}
        >
          <div className="rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="py-1">
              <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">View profile</a>
              <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Notifications</a>
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="py-1">
              <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Support</a>
            </div>
            <div className="border-t border-gray-100"></div>
            <div className="py-1">
              <a href="/logout" 
                className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Logout</a>
            </div>
          </div>
        </Dropdown>
        <button>
          <FontAwesomeIcon className="h-6 w-6 text-gray-500" icon={['fad', 'sort-amount-up']} size="1x"/>
        </button>
      </div>
      <Assignments/>
    </section>
  );
}

function Archives() {
  return (
    <LayoutProvider>
      <Layout title="Archives">
        <main className="flex-1 flex bg-gray-200">
          <AssignmentSection/>
        </main>
      </Layout>
    </LayoutProvider>
  )
}

export async function getServerSideProps(ctx) {
  const apolloClient = initializeApollo(ctx.req.headers.cookie);
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  }
}

export default Archives;