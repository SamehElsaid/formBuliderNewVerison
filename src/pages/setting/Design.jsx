import React, { useState } from 'react'
import { BsPaperclip, BsTrash } from 'react-icons/bs'
import { useIntl } from 'react-intl'

function Design() {
  const [selectedFruit, setSelectedFruit] = useState('Cherry') // Default to 'Cherry'
  const [fileNames, setFileNames] = useState([]) // State to store file names
  const { locale } = useIntl()

  // Handle file selection
  const handleChange = e => {
    const files = e.target.files
    const names = Array.from(files).map(file => file.name)
    setFileNames(prevNames => [...prevNames, ...names]) // Add new files to the existing list
  }

  // Handle file deletion
  const handleDelete = (index,e) => {
    e.stopPropagation()
    setTimeout(() => {
      setFileNames(prevNames => prevNames.filter((_, i) => i !== index)) // Remove the file at the specified index
    }, 0);
  }

  return (
    <div>
      <div className='file-upload-container'>
        <label htmlFor='dropzone-file' className='file-upload-label'>
          <div className='file-upload-content'>
            <svg
              className='file-upload-icon'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 16'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
              />
            </svg>
            <p className='file-upload-text'>
              <span className='font-semibold'>{locale === 'ar' ? 'اضف الصورة' : 'Add Image'}{" "}</span>
              {locale === 'ar' ? 'أو اسحب وأفلت' : 'or drag and drop'}
            </p>
            <p className='file-upload-subtext'>
              {locale === 'ar' ? 'SVG, PNG, JPG or GIF (MAX. 800x400px)' : 'SVG, PNG, JPG or GIF (MAX. 800x400px)'}
            </p>
            {fileNames.length !== 0 && (
              <div className='flex flex-col gap-1 p-2 mt-5 rounded-md shadow-inner shadow-gray-300 file-names-container'>
                {fileNames.map((name, index) => (
                  <div key={index} className='flex gap-3 items-center file-name-item'>
                    <span className='flex gap-1 items-center file-name w-[calc(100%-25px)]'>
                      <BsPaperclip className='text-xl text-main-color' />
                      <span className='flex-1'>{name}</span>
                    </span>
                    <button
                      className='delete-button w-[25px] h-[25px] bg-red-500/70 rounded-full text-white hover:bg-red-500/90 transition-all duration-300 flex items-center justify-center'
                      onClick={(e) => handleDelete(index,e)} // Handle delete action
                    >
                      <BsTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            id='dropzone-file'
            type='file'
            className='file-upload-input'
            onChange={handleChange}
            multiple // Allow multiple files
          />
        </label>
      </div>

      {/* Display the file names with delete icons */}
    </div>
  )
}

export default Design
