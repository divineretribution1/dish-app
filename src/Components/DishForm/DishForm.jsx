import React, { useState } from 'react';
import axios from 'axios';
import { startCase, camelCase } from 'lodash'
import './DishForm.css';

export const DishForm = () => {

  const defaultFormState = {
    dishName: '',
    preparationTime: '',
    dishType: '',
    noOfSlices: '',
    diameter: '',
    spicinessScale: '',
    slicesOfBread: ''
  }

  const [formState, setFormState] = useState(defaultFormState)

  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    dishType, dishName, noOfSlices, diameter, spicinessScale, slicesOfBread, preparationTime } = formState

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      await axios.post(
        'https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/',
        {
          name: dishName,
          preparation_time: preparationTime,
          type: dishType,
          ...(dishType === 'pizza' && { no_of_slices: noOfSlices, diameter }),
          ...(dishType === 'soup' && { spiciness_scale: spicinessScale }),
          ...(dishType === 'sandwich' && { slices_of_bread: slicesOfBread }),
        }
      );
      setFormState(defaultFormState)
      setServerErrors({});
    } catch (error) {
      setServerErrors(error.response.data);
    }

    setIsSubmitting(false);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev, [name]: value
    }))
  }

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (!value) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: `${startCase(camelCase(name))} is required` }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
  };

  const isFormValid = () => {
    return (
      dishName &&
      preparationTime &&
      dishType &&
      ((dishType === 'pizza' && noOfSlices && diameter) ||
        (dishType === 'soup' && spicinessScale) ||
        (dishType === 'sandwich' && slicesOfBread))
    );
  };

  const dishTypeOptions = [
    {
      label: 'Select a type', value: '', disabled: true
    },
    {
      label: 'Pizza', value: 'pizza'
    },
    {
      label: 'Soup', value: 'soup'
    },
    {
      label: 'Sandwich', value: 'sandwich'
    }]

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="container">
        <div className="box">
          <div className="content">
            <h2>Create a New Dish</h2>
            <div>
              <input
                type="text"
                className="field field-item"
                placeholder="Enter a dish name"
                name="dishName"
                value={formState.dishName}
                onChange={onChangeHandler}
                onBlur={handleBlur}
                required
              />
              {errors.dishName && <span className="error">{errors.dishName}</span>}
            </div>

            <div>
              <label htmlFor="preparationTime">Preparation Time</label>
              <input
                type="time"
                className="field field-item"
                name='preparationTime'
                value={formState.preparationTime}
                onChange={onChangeHandler}
                step="1"
                required
                onBlur={handleBlur}
              />
              {errors.preparationTime && <span className="error">{errors.preparationTime}</span>}

            </div>

            <div>
              <label htmlFor="dishType">Dish Type</label>
              <select
                className="field field-item"
                value={formState.dishType}
                name='dishType'
                onChange={onChangeHandler}
                required
                onBlur={handleBlur}
              >
                {dishTypeOptions.map((dishType) => <option key={dishType.value} disabled={dishType.disabled} value={dishType.value}>{dishType.label}</option>
                )}
              </select>

            </div>

            {dishType === 'pizza' && (
              <>
                <div>
                  <label htmlFor="noOfSlices">Number Of Pizza Slices</label>
                  <input
                    type="number"
                    className="field field-item"
                    min="1"
                    name='noOfSlices'
                    value={noOfSlices}
                    onChange={onChangeHandler}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.noOfSlices && <span className="error">{errors.noOfSlices}</span>}
                </div>
                <div>
                  <label htmlFor="diameter">Diameter</label>
                  <input
                    type="number"
                    className="field field-item"
                    min="1"
                    step="0.1"
                    name='diameter'
                    value={diameter}
                    onBlur={handleBlur}
                    onChange={onChangeHandler}
                    required
                  />
                  {errors.diameter && <span className="error">{errors.diameter}</span>}
                </div>
              </>
            )}

            {dishType === 'soup' && (
              <div>
                <label htmlFor="spicinessScale">Spiciness Scale</label>
                <input
                  type="number"
                  className="field field-item"
                  min="1"
                  max="10"
                  name='spicinessScale'
                  value={spicinessScale}
                  onChange={onChangeHandler}
                  onBlur={handleBlur}
                  required
                />
                {errors.spicinessScale && <span className="error">{errors.spicinessScale}</span>}
              </div>
            )}

            {dishType === 'sandwich' && (
              <div>
                <label htmlFor="slicesOfBread">Slices of Bread</label>
                <input
                  type="number"
                  className="field field-item"
                  min="0"
                  name='slicesOfBread'
                  value={slicesOfBread}
                  onChange={onChangeHandler}
                  onBlur={handleBlur}
                  required
                />
                {errors.slicesOfBread && <span className="error">{errors.slicesOfBread}</span>}
              </div>
            )}

            <button type="submit" disabled={!isFormValid() || isSubmitting} className="button">Submit</button>

            {Object.keys(serverErrors).length > 0 && (
              <ul>
                {Object.entries(serverErrors).map(([fieldName, fieldErrors]) =>
                  fieldErrors.map((error, index) => (
                    <li className="error" key={`${fieldName}-${index}`}>{`${fieldName}: ${error}`}</li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
