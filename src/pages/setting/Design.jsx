import React, { useState } from 'react';

function Design() {
  const [selectedFruit, setSelectedFruit] = useState('Cherry'); // Default to 'Cherry'

  const handleChange = (e) => {
    setSelectedFruit(e.target.value); // Update the selected fruit
  };

  return (
    <div>
      <div id='view-input-in-form-engine'>
        <input
          type='radio'
          id='fruit1'
          name='fruit'
          value='Apple'
          checked={selectedFruit === 'Apple'}
          onChange={handleChange}
        />
        <label htmlFor='fruit1'>Apple</label>

        <input
          type='radio'
          id='fruit3'
          name='fruit'
          value='Cherry'
          checked={selectedFruit === 'Cherry'}
          onChange={handleChange}
        />
        <label htmlFor='fruit3'>Cherry</label>

        <input
          type='radio'
          id='fruit4'
          name='fruit'
          value='Strawberry'
          checked={selectedFruit === 'Strawberry'}
          onChange={handleChange}
        />
        <label htmlFor='fruit4'>Strawberry</label>
      </div>

      <p>Selected Fruit: {selectedFruit}</p> {/* Display the selected fruit */}
    </div>
  );
}

export default Design;
