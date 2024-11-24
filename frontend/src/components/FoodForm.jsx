import { useState } from 'react'
import PropTypes from 'prop-types'
import RegionSelect from './RegionSelect'
import './FoodForm.css'

const FoodForm = ({ onFoodCreated }) => {
  const [newFood, setNewFood] = useState({
    name: '',
    price: '',
    portion: 'kg',
    region: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Convert price to number
      const foodToCreate = {
        ...newFood,
        price: Number(newFood.price)
      }
      
      // Clear form
      setNewFood({
        name: '',
        price: '',
        portion: 'kg',
        region: ''
      })
      
      // Notify parent component
      onFoodCreated(foodToCreate)
    } catch (error) {
      console.error('Error creating food:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="food-form">
      <h2>Add New Food Item</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={newFood.name}
          onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
          required
          minLength={3}
        />
      </div>
      
      <div>
        <label htmlFor="price">Price:</label>
        <input
          id="price"
          type="number"
          step="0.01"
          value={newFood.price}
          onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
          required
          min={0}
        />
      </div>

      <div>
        <label htmlFor="portion">Portion:</label>
        <select
          id="portion"
          value={newFood.portion}
          onChange={(e) => setNewFood({ ...newFood, portion: e.target.value })}
          required
        >
          <option value="kg">kg</option>
          <option value="lb">lb</option>
          <option value="g">g</option>
          <option value="oz">oz</option>
        </select>
      </div>

      <RegionSelect
        value={newFood.region}
        onChange={(region) => setNewFood({ ...newFood, region })}
      />

      <button type="submit">Add Food</button>
    </form>
  )
}

FoodForm.propTypes = {
  onFoodCreated: PropTypes.func.isRequired
}

export default FoodForm 