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

      setEventLog((prev) => [...prev, newEvent])

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

      setEventLog((prev) => [...prev, newEvent])

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
        const end = new Date().valueOf()
        const newEvent: Event = {
          name: 'createUser',
          start,
          end,
        }
        setEventLog((prev) => [...prev, newEvent])

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
      <button onClick={handleMockRequest}>Mock request</button>
      {/* Create user form */}
      <div className="grid gap-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="username" className="text-sm">
              Name
            </label>
            <input
              onChange={(e) => {
                setUsernameInput(e.target.value)
              }}
              type="text"
              name="username"
              id="username"
              className="rounded border border-slate-400 py-2 px-4"
            />
          </div>
          <button
            disabled={createIsLoading}
            type="submit"
            className="roundedbg-indigo-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            Create User
          </button>
        </form>
        {/* Users listing */}
        <div>
          <p>Users:</p>
          {!data && <p>No users</p>}
          {data && (
            <ul className="ml-8 list-disc">
              {data.users.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => {
            refetch()
          }}
          className="rounded border-2 border-indigo-400 px-4 py-2 text-indigo-400"
        >
          {isFetching ? 'Refetching...' : 'Refetch users'}
        </button>
      </div>
      {/* Event log */}
      <div>
        <h2>Log</h2>
        <ul>
          {eventLog.map((event, index) => (
            <li key={index}>
              {event.name}: ~{event.end - event.start}ms
            </li>
          ))}
        </ul>
        <button onClick={clearEventLog}>Clear log</button>
      </div>
    </div>
  )
}

export default LambdaTest
