import { LayoutProvider } from '../../contexts/layout';
import { Layout } from "../../layout";
import { initializeApollo } from '../../lib/apollo';
import { AssignmentSection } from "../../components/Assignment/List";
import { InactiveAssignmentViewIllustration } from '../../components/Assets';

function Assignments() {
  return (
    <LayoutProvider>
      <Layout title="Assignments">
        <main className="flex-1 flex bg-gray-200">
          <AssignmentSection/>
          <section className="hidden md:flex md:flex-col md:justify-center md:items-center w-full">
            <InactiveAssignmentViewIllustration />
            <h2 className="font-medium text-gray-500">Select an assignment to view</h2>
            <p className="max-w-lg text-gray-400 text-justify mt-2">Please select an assignment from the list on the left to get started with viewing your submission grading report or submit your work.</p>
          </section>
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

export default Assignments