import React, { useContext, useReducer, useEffect  } from "react"
import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseCloudMessaging } from "../lib/webpush";
import toast, { Toaster } from "react-hot-toast";
import {useZinc} from "./zinc"
import { Notification, NotificationBody} from "../components/Notification";

// import { SubmissionNotification , Notification} from "../components/SubmissionNotification";
import submissions from "../pages/api/submissions";


interface LayoutAction {
  type: string;
  payload?: any;
}

interface LayoutState {
  showMobileMenu: boolean
  showModal: boolean
  showSlideOver: boolean
  showNotification: boolean
  notification?: any
  stdioTestCase?: any
  cache: any
  reportId?: string
  valgrindTestCase?: any
  modalType?: string
}

function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case 'toggleModal':
      return {...state, showModal: !state.showModal, cache: {...state.cache}}
    case 'toggleSlideOver':
      return {...state, showSlideOver: !state.showSlideOver, cache: action.payload}
    case 'toggleMobileMenu':
      return {...state, showMobileMenu: !state.showMobileMenu}
    case 'closeModal':
      return {...state, showModal: false}
    case 'closeSlideOver': 
      return {...state, showSlideOver: false}
    case 'closeMobileMenu':
      return {...state, showMobileMenu: false}
    // case 'showNotification':
    //   return {...state, showNotification: true, notification: action.payload }
    case 'showNotification':
      toast.custom((t) =>(
        <Notification trigger={t}>
          <NotificationBody
            title={action.payload.title}
            body={action.payload.message}
            success={action.payload.success}
            id={t.id} />
        </Notification>
      ));
      return {...state, showNotification: true, notification: action.payload }
    case 'dismissNotification':
      toast.dismiss(action.payload)
      return {...state, showNotification: false}
    case 'viewStdioComparison': 
      return {...state, showModal: true, stdioTestCase: action.payload, modalType: 'stdiotest' }
    case 'viewValgrindReport':
      return {...state, showModal: true, valgrindTestCase: action.payload, modalType: 'valgrind' }
    case 'viewReport':
      return {...state, showSlideOver: true, reportId: action.payload }
    default:
      return state;
  }
}

const initialLayoutState: LayoutState = {
  showMobileMenu: false,
  showModal: false,
  showSlideOver: false,
  showNotification: false,
  cache: null
}

interface LayoutProviderProps {
  children: React.ReactNode
}

const LayoutStateContext = React.createContext({} as LayoutState);
const LayoutDispatchContext = React.createContext({} as React.Dispatch<LayoutAction>)

export const useLayoutState = () => useContext(LayoutStateContext)
export const useLayoutDispatch = () => useContext(LayoutDispatchContext);

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const {user, currentSemester} = useZinc();
  const [state, dispatch] = useReducer<React.Reducer<LayoutState, LayoutAction>>(layoutReducer, initialLayoutState)
  useEffect(() => {
    setupNotification();
    async function setupNotification() {
      try {
        const token = await firebaseCloudMessaging.init();
        console.log('after token')
        console.log(token)
        if(token) {
          const messaging = getMessaging();
          // TODO: call API to fetch lastest notification 
          const notiRes = await fetch(`/api/notification/getNotification?&id=${user}`,{
            method: 'GET'
          });
          const noti = await notiRes.json()
          const notification = noti.notification
          console.log('testing 1')
          console.log(token, notification)
          // if the fetch token is not the same as DB
          if(token != notification){
            console.log("updating")
            // update the DB one
            const response = await fetch(`/api/notification/update`,{
              method: 'POST',
              body: JSON.stringify({
                registrationToken: token,
                userId: user,
                currentSemester
              })
            });
            console.log(await response.json())
            console.log("updated")
          }
          // for(let i=0;i<1;i++){
          //   toast.custom((t) =>(
          //     <Notification trigger={t.visible}>
          //       <NotificationBody title={"testing"} body={"testing"} success={true} id = {t.id}></NotificationBody>
          //     </Notification>
          //   ))
          // }
          dispatch({ type: 'setRegistrationToken', payload: token });
          onMessage(messaging, message => {
            console.log("message recevied")
            console.log(message.data!.title)
            console.log(message.data!.body)
            const {title, body} = message.data!
            toast.custom((t) =>(
              <Notification trigger={t}>
                <NotificationBody title = {title} body={body} id={t.id} success={true}></NotificationBody>
              </Notification>
            ))
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [])
  return (
    <LayoutDispatchContext.Provider value={dispatch}>
      <LayoutStateContext.Provider value={state}>
        <Toaster position="top-right" />
        { children }
      </LayoutStateContext.Provider>
    </LayoutDispatchContext.Provider>
  )
}