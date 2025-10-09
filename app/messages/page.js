import MessagesPage from "../components/MessagesPage"

export default function Messages() {
  // You would typically get the user from your auth context or props
  const user = {
    id: 1,
    name: 'Current User',
    email: 'user@example.com'
  }

  return <MessagesPage user={user} />
}