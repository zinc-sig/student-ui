import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import axios from "axios";
import { SIDEBAR } from "../graphql/queries/user";
import JSZip from "jszip";

interface ZincContextState {
  user: number
  currentSemester: number
  activeSemester: number
  useSidebar: () => any,
  visibleCourses: Array<number>;
  setVisibleCourses: React.Dispatch<React.SetStateAction<number[]>>
  submitFile: (files) => Promise<void>
}

interface ZincProviderProps {
  children: JSX.Element
  user: number
  semester: number
}

(function () {
  if(typeof window !== 'undefined') {
    File.prototype.arrayBuffer = File.prototype.arrayBuffer || myArrayBuffer;
    Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || myArrayBuffer;

    function myArrayBuffer() {
      // this: File or Blob
      return new Promise((resolve) => {
        let fr = new FileReader();
        fr.onload = () => {
          resolve(fr.result);
        };
        // @ts-ignore
        fr.readAsArrayBuffer(this);
      })
    }
  }
})();

async function getChecksum(file) {
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(digest));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const ZincContext = React.createContext({} as ZincContextState);
const supportedCodeSubmissionExtensions = [
  'h',
  'hpp',
  'cpp',
  'py',
  'java'
]
export const useZinc = () => useContext(ZincContext);

export const ZincProvider = ({ children, user, semester }: ZincProviderProps) => {

  const router = useRouter();
  const { semesterId } = router.query;
  const [visibleCourses, setVisibleCourses] = useState<Array<number>>([]);
  const activeSemester = semesterId?parseInt((semesterId as string), 10):semester;

  const submitFile = async (files) => {
    const form = new FormData();
    const { assignmentId } = router.query;
    form.append('assignmentConfigId', (assignmentId as string));
    if (files.length > 1 || files.length===1 && supportedCodeSubmissionExtensions.includes(files[0].name.split('.').pop())) {
      const zip = new JSZip();
      for(const file of files){
        zip.file(file.name, file);
      }
      const blob = await zip.generateAsync({type:"blob"});
      const file = new File([blob], `aggregated.zip`, { lastModified: Date.now() });
      const digest = await getChecksum(file);
      form.append(`checksum;${file.name}`, digest);
      form.append('files', file, file.name);
    } else {
      const digest = await getChecksum(files[0]);
      form.append(`checksum;${files[0].name}`, digest);
      form.append('files', files[0], files[0].name);
    }
    try {
      const { data } = await axios({
        method: 'post',
        url: '/api/submissions',
        data: form,
        headers: {'Content-Type': 'multipart/form-data' }
      })
      return data;
    } catch (error) {
      console.error(error)
    }
  }

  const useSidebar = () => useQuery(SIDEBAR, {
    variables: {
      userId: user,
      semesterId: semester
    }
  });

  return (
    <ZincContext.Provider
      value={{
        user,
        activeSemester,
        currentSemester: semester,
        visibleCourses,
        setVisibleCourses,
        useSidebar,
        submitFile
    }}>
      { children }
    </ZincContext.Provider>
  )
}
