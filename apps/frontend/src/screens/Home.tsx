import ApplicationList from '../components/ApplicationList'
import UploadForm from '../components/UploadForm'

const Home = () => {
  return (
    <div class="space-y-8">
      <UploadForm />
      <ApplicationList />
    </div>
  )
}

export default Home
