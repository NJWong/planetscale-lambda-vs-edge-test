import { FormEvent, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GetUsersData } from './api/lambda/getUsers'
import { CreateUserInput } from './api/lambda/createUser'

interface Event {
  name: string
  start: number
  end: number
}

const LambdaTest = () => {
  const queryClient = useQueryClient()
  const [usernameInput, setUsernameInput] = useState('')
  const [eventLog, setEventLog] = useState<Event[]>([])

  const { isLoading, error, data, refetch, isFetching } = useQuery(
    ['getUsers'],
    async () => {
      const start = new Date().valueOf()
      const res = await fetch('/api/lambda/getUsers')
      const end = new Date().valueOf()
      const data: GetUsersData = await res.json()

      const newEvent: Event = {
        name: 'getUsers',
        start,
        end,
      }

      setEventLog((prev) => [newEvent, ...prev])

      return data
    },
  )

  const { refetch: getMockData } = useQuery(
    ['getMockData'],
    async () => {
      const start = new Date().valueOf()
      const res = await fetch('/api/lambda/getUsers')
      const end = new Date().valueOf()
      const data = await res.json()

      const newEvent: Event = {
        name: 'getMockData',
        start,
        end,
      }

      setEventLog((prev) => [newEvent, ...prev])

      return data
    },
    { enabled: false },
  )

  const { isLoading: createIsLoading, mutate: createUser } = useMutation(
    (newUser: CreateUserInput) => {
      return fetch('/api/lambda/createUser', {
        method: 'POST',
        body: JSON.stringify(newUser),
      })
    },
  )

  const handleMockRequest = () => {
    getMockData()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const start = new Date().valueOf()
    const newUser = { name: usernameInput }

    createUser(newUser, {
      onSuccess: () => {
        setUsernameInput('')

        const end = new Date().valueOf()
        const newEvent: Event = {
          name: 'createUser',
          start,
          end,
        }
        setEventLog((prev) => [newEvent, ...prev])

        queryClient.invalidateQueries(['getUsers'])
      },
    })
  }

  const clearEventLog = () => {
    setEventLog([])
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return (
    <div className="grid gap-8">
      <h1 className="text-3xl">Lambda Test</h1>

      {/* Create user form */}
      <div className="grid gap-4">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded border border-slate-600 p-4"
          autoComplete="off"
        >
          <h2 className="text-xl">Create New User</h2>
          <div className="grid gap-1">
            <label htmlFor="username" className="text-sm text-slate-400">
              Name
            </label>
            <input
              onChange={(e) => {
                setUsernameInput(e.target.value)
              }}
              value={usernameInput}
              type="text"
              name="username"
              id="username"
              required
              className="rounded border-2 border-slate-800 py-2 px-4 text-slate-800 outline-none ring-pink-500/70 ring-offset-1 ring-offset-transparent focus:ring-1"
            />
          </div>
          <button
            disabled={createIsLoading}
            type="submit"
            className="rounded border-2 border-slate-800 bg-pink-500 px-4 py-2 text-sm text-white outline-none ring-pink-500/70 ring-offset-1 ring-offset-transparent hover:bg-pink-600 focus:ring-1 disabled:cursor-not-allowed disabled:bg-pink-400"
          >
            Submit
          </button>
        </form>

        {/* Users listing */}
        <div className="grid gap-4">
          <div className="flex items-center gap-6">
            <h2 className="flex items-center gap-2 text-xl">
              Users{' '}
              {data && (
                <span className="flex items-center rounded-full bg-slate-500 px-1 py-0.5 text-xs text-white">
                  {data.users.length}
                </span>
              )}
            </h2>

            <button
              onClick={() => {
                refetch()
              }}
              className="rounded border-2 border-pink-500 px-2 py-1 text-sm text-pink-500"
            >
              {isFetching ? 'Refetching...' : 'Refetch users'}
            </button>
          </div>

          {!data && <p>No users</p>}
          {data && (
            <ul className="grid max-h-[400px] gap-2 overflow-scroll rounded border border-slate-600 p-4">
              {data.users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between rounded border border-slate-500 bg-slate-600 px-5 py-3"
                >
                  <span className="font-semibold">{user.name}</span>
                  <button className="rounded text-xs font-semibold tracking-wide text-slate-400 hover:underline">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Event log */}
      <div>
        <h2>Log</h2>
        <ul className="grid max-h-[400px] gap-2 overflow-scroll rounded border border-slate-600 p-4">
          {eventLog.map((event, index) => (
            <li key={index}>
              <>
                {event.name}: ~{event.end - event.start}ms -{' '}
                {new Date(event.start).toLocaleString()}
              </>
            </li>
          ))}
        </ul>
        <div className="flex gap-4">
          <button onClick={clearEventLog} className="px-4 py-2 text-sm">
            Clear log
          </button>
          <button onClick={handleMockRequest}>Mock request</button>
        </div>
      </div>
    </div>
  )
}

export default LambdaTest
