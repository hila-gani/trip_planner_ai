import TripPlanner from "@/components/trip-planner/trip-planner"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Smart Trip Planner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create your perfect adventure with our AI-powered trip planning assistant
          </p>
        </div>
        <TripPlanner />
      </div>
    </main>
  )
}
