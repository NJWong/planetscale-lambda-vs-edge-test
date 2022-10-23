import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl">PlanetScale Edge vs. Lambda Test</h1>
      <p>The purpose of this app is to compare the network latency when connecting to a PlanetScale database using:</p>
      <ul className="list-disc ml-8">
        <li>Vercel Edge Functions (Edge)</li>
        <li>Vercel Serverless Functions (Lambda)</li>
      </ul>
      <p>Each of the <code>/api/*</code> functions in the backend will connect to PlanetScale using Kysley and the Kysley Dialect <code>keysely-planetscale</code>.</p>
      <p>Under the hood, this Dialect uses the PlanetScale servless driver.</p>
    </div>
  )
}

export default Home
