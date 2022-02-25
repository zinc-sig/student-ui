import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, useDropdown } from "../Dropdown";
import Switch from "../Switch";
import { useZinc } from "../../contexts/zinc";
import { useEffect } from "react";
import ActiveLink from "./ActiveLink";

export function User({ name, initials }) {
  const { toggleDropdown, display } = useDropdown();
  return (
    <button
      onClick={() => toggleDropdown()}
      onBlur={() => { if(display) { toggleDropdown()}}}
      className="w-full flex items-center focus:outline-none">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 text-sm text-blue-800 flex justify-center items-center">{initials}</div>
      <span className="mr-2 text-sm font-medium text-white ml-4 truncate">{name}</span>
      <svg className="ml-auto h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
      </svg>
    </button>
  )
}

export function UserDropdown ({ name, initials }) {
  return (
    <div className="hidden md:block w-64 flex-shrink-0 px-4 py-3 bg-cse-800">
      <Dropdown
        className="z-10 mx-3 origin-top absolute right-0 left-1  mt-2 rounded-md shadow-lg w-56"
        trigger={<User name={name} initials={initials}/>}
      >
        <div className="rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {/* <div className="py-1">
            <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">View profile</a>
            <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Settings</a>
            <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Notifications</a>
          </div>
          <div className="border-t border-gray-100"></div>
          <div className="py-1">
            <a href="#" className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Support</a>
          </div>
          <div className="border-t border-gray-100"></div> */}
          <div className="py-1">
            <a href="/logout" 
              className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">Logout</a>
          </div>
        </div>
      </Dropdown>
    </div>
  )
}

function CourseList({ courses }) {
  const { visibleCourses, setVisibleCourses } = useZinc();

  useEffect(() => {
    setVisibleCourses(courses.map(({course}) => course.id))
  }, []);

  return (
    <div className="mt-8">
      {/* <!-- Secondary navigation --> */}
      <h3 className="text-xs leading-4 font-semibold text-gray-500 uppercase tracking-wider" id="courselisting-headline">
        Recent Courses
      </h3>
      <div className="mt-6 space-y-2" role="group" aria-labelledby="teams-headline">
        { courses.map(({ course, role }) => (
          <a key={course.id} className={`group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition ease-in-out duration-150`}>
            <Switch value={true} className="mr-2" variant="indigo" size="sm" onChange={visible => setVisibleCourses(visible?[...visibleCourses, course.id]:visibleCourses.filter(id => id!==course.id))}/>
            <span className="truncate flex items-center">
              { course.code }
              {
                role!=='Student' && (
                  <svg className="ml-1.5 h-2 w-2 text-blue-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                )
              }
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export function Navigation({ courses }) {

  const router = useRouter();

  return (
    <div className="hidden md:block w-64 p-6 bg-gray-100 overflow-y-auto">
      <nav>
        <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Overview
        </h2>
        <div className="space-y-2 mt-6">
          <ActiveLink href="/assignments">
            <span className="w-8 mr-2 flex justify-center">
              <FontAwesomeIcon icon={["fad", 'laptop-code']} size="lg"/>
            </span>
            Assignments
          </ActiveLink>
          {/* <ActiveLink href="/archives">
            <span className="w-8 mr-2 flex justify-center">
              <FontAwesomeIcon icon={["fad", 'archive']} size="lg"/>
            </span>
            Archives
          </ActiveLink>
          <ActiveLink href="/grades">
            <span className="w-8 mr-2 flex justify-center">
              <FontAwesomeIcon icon={["fad", 'analytics']} size="lg"/>
            </span>
            Grades
          </ActiveLink> */}
        </div>
        <CourseList courses={courses}/>
      </nav>
    </div>
  )
}

const UserPreferenceDropdownTrigger = () => {
  const { toggleDropdown, display } = useDropdown();

  return (
    <div>
      <button 
        onClick={() => toggleDropdown()}
        onBlur={() => { if(display) { toggleDropdown()}}}
        type="button"
        className="group w-full rounded-md px-3.5 py-2 text-sm leading-5 font-medium text-white hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:bg-gray-200 focus:border-blue-300 active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center justify-between space-x-3">
          </div>
        </div>
      </button>
    </div>
  )
}