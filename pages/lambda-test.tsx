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

  const { isLoading, error, data } = useQuery(['getUsers'], async () => {
    const start = new Date().valueOf()
    const res = await fetch('/api/lambda/getUsers')
    const end = new Date().valueOf()
    const data: GetUsersData = await res.json()

    const newEvent: Event = {
      name: 'getUsers',
      start,
      end,
    }

    setEventLog(prev => [...prev, newEvent])

    return data
  })

  const {
    isLoading: createIsLoading,
    mutate: createUser
  } = useMutation((newUser: CreateUserInput) => {
    return fetch('/api/lambda/createUser', {
      method: 'POST',
      body: JSON.stringify(newUser),
    })
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const start = new Date().valueOf()
    createUser({ name: usernameInput }, {
      onSuccess: () => {
        const end = new Date().valueOf()
        const newEvent: Event = {
          name: 'createUser',
          start,
          end,
        }
        setEventLog(prev => [...prev, newEvent])

        queryClient.invalidateQueries(['getUsers'])
      }
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return (
    <div className="grid gap-8">
      <h1 className="text-3xl">Lambda Test</h1>
      {/* Create user form */}
      <div className="grid gap-4">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="username" className="text-sm">Name</label>
            <input onChange={(e) => { setUsernameInput(e.target.value) }} type="text" name="username" id="username" className="border border-slate-400 px-4 py-2 rounded" />
          </div>
          <button disabled={createIsLoading} type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded disabled:bg-indigo-300 disabled:cursor-not-allowed">Create User</button>
        </form>
        {/* Users listing */}
        <div>
          <p>Users:</p>
          {!data && (
            <p>No users</p>
          )}
          {data && (
            <ul className="list-disc ml-8">
              {data.users.map(user => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Event log */}
      <div>
        <h2>Log</h2>
        <ul>
          {eventLog.map((event, index) => (
            <li key={index}>{event.name}: ~{event.end - event.start}ms</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default LambdaTest