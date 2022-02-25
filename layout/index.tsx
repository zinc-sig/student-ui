import React from "react";
import Link from "next/link";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserDropdown, Navigation } from "../components/Navigation/Desktop";
import { MobileMenuToggle } from "../components/Navigation/Mobile";
import { useZinc } from "../contexts/zinc";

interface LayoutProps {
  title?: string
  children?: JSX.Element
}

export function Layout({ children, title }: LayoutProps) {

  const { useSidebar } = useZinc();
  const { data, loading, error } = useSidebar();
  console.log(error)

  return (
    <div className="h-screen flex flex-col">
      <Head>
        <title>{ title } - Zinc</title>
      </Head>
      <header className="flex flex-shrink-0 h-14">
        { !loading && <UserDropdown name={data.user.name} initials={data.user.initials}/>}
        <div className="flex-1 flex items-center justify-between px-6 bg-cse-700">
          <nav className="flex">
            {/* <a href="#" className="inline-block ml-2 bg-cse-800 rounded-md px-3 py-2 leading-none text-sm font-medium text-white">All</a>
            <a href="#" className="inline-block ml-2 px-3 py-2 rounded-md leading-none text-sm font-medium text-white hover:bg-cse-600 transition ease-in-out duration-150">Lab</a>
            <a href="#" className="inline-block ml-2 px-3 py-2 rounded-md leading-none text-sm font-medium text-white hover:bg-cse-600 transition ease-in-out duration-150">Assignment</a>
            <a href="#" className="inline-block ml-2 px-3 py-2 rounded-md leading-none text-sm font-medium text-white hover:bg-cse-600 transition ease-in-out duration-150">Group Project</a> */}
          </nav>
          {/* <MobileMenuToggle/> */}
          <div className="hidden md:flex items-center">
            {/* <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 pl-2 flex items-center">
                <FontAwesomeIcon className="h-5 w-5 text-gray-500" icon={['fad', 'search']} size="lg"/>
              </span>
              <input
                className="block w-full bg-cse-900 rounded-lg text-sm placeholder-gray-400 text-white pl-10 pr-4 px-4 py-2 focus:bg-white focus:placeholder-gray-600 focus:text-gray-900 focus:outline-none transition ease-in-out duration-150"
                placeholder="Search"
              />
            </div> */}
            {/* <button className="ml-4 p-2 border-2 h-8 w-8 flex items-center justify-center border-transparent rounded-full focus:bg-cse-600 focus:outline-none text-gray-400 hover:text-gray-200 transition ease-in-out duration-150" aria-label="Notifications" data-flow="down">
              <FontAwesomeIcon icon={['fad', 'bell']} />
            </button> */}
            <a href="/guide" className="ml-4 p-2 border-2 flex items-center justify-center border-transparent rounded-md focus:bg-cse-600 focus:outline-none text-gray-400 hover:text-gray-200 transition ease-in-out duration-150">
              <FontAwesomeIcon className="h-8 w-8" icon={['fad', 'question-circle']} />
              <span className="ml-2 leading-none text-sm font-medium text-white">Submission Guideline</span>
            </a>
          </div>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        { !loading && <Navigation courses={data.user.courses}/> }
        { children }
      </div>
    </div>
  )
}