import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showFormAddFriend, setShowFormAddFriend] = useState(false)
  const [friends, setFriends] = useState(initialFriends)
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleShowAddFriend() {
    setShowFormAddFriend(show => !show)
  }

  function handleAddFriend(friend) {
    setFriends(() => [...friends, friend])
    setShowFormAddFriend(show => !show)
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend(() => selectedFriend?.id === friend.id ? 'null' : friend)
    setShowFormAddFriend(show => !show)
  }

  function handleSplitBill(value) {
    setFriends(() => friends.map(friend => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))

    setSelectedFriend(null) //Đảm bảo không lưu lại trạng thái của form khi select friend khác
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} onSelectedFriend={handleSelectedFriend} selectedFriend={selectedFriend} />
        {showFormAddFriend && <FormAddFirend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>{showFormAddFriend ? 'Close' : 'Add friend'}</Button>
      </div>

      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} />}
    </div>
  )
}

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

function FriendList({ friends, onSelectedFriend, selectedFriend }) {

  return (
    <ul>
      {friends.map(friend => (
        <Friend friend={friend} key={friend.id} onSelectedFriend={onSelectedFriend} selectedFriend={selectedFriend} />
      ))}
    </ul>
  )
}

function Friend({ friend, onSelectedFriend, selectedFriend }) {
  const isSelectedFriend = selectedFriend?.id === friend.id

  return (
    <li className={isSelectedFriend ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}💶
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}💶
        </p>
      )}

      {friend.balance === 0 && (
        <p>
          You and {friend.name} are even
        </p>
      )}

      <Button onClick={() => onSelectedFriend(friend)}>{isSelectedFriend ? 'Close' : 'Select'}</Button>
    </li>
  )
}



function FormAddFirend({ onAddFriend }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48') //Ảnh mặc định random với size 48

  function handleSubmit(e) {
    e.preventDefault()

    if (!name || !image) return;

    const id = crypto.randomUUID()
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0
    }

    onAddFriend(newFriend)

    setName('')
    setImage('https://i.pravatar.cc/48')
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>😊Friendname</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>🖼️Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("")
  const [paidByUser, setPaidByUser] = useState("")
  const paidByFriend = bill ? bill - paidByUser : ""
  const [whoPaidBill, setWhoPaidBill] = useState("user")

  function handleSubmit(e) {
    e.preventDefault()

    if (!bill || !paidByUser) return;

    onSplitBill(whoPaidBill === 'user' ? paidByFriend : -paidByUser)
  }


  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰Bill value</label>
      <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))} />

      <label>🕴️Your expense</label>
      <input type="text" onChange={(e) => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))} value={paidByUser} />

      <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑Who is paying the bill</label>
      <select value={whoPaidBill} onChange={(e) => setWhoPaidBill(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  )
}