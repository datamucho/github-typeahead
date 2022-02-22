import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const Search = () => {

  const [inputValue, setInputValue] = useState('');
  const [typeaheadData, setTypeaheadData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    handleChange();
  }, [inputValue])

  const handleChange = async () => {  
    //fetching data with input value
    try{
      const res = await fetch(`https://api.github.com/search/users?q=${inputValue}`,{ 
      headers: {
        Authorization: `token ${process.env.REACT_APP_GH}`,
      },
      });

      if (res.status === 403){
        setError("Rate Limit");
      }else{
        setError("");
      }

      const data = await res.json();

      if (data.items){
        setTypeaheadData(data.items);
      }
      
    }catch(error){
      setError(error);
    }    
  }

  
  return (
    <div className="search">
        <div className="inputs">

            <input 
              type='text'
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Search Github users" 
              name='search'
              value={inputValue}
              />

              {inputValue
              ?<span className="search-icon" 
                onClick={()=>{
                  setInputValue('');
                  setTypeaheadData([]);
                }}><CloseIcon/></span>

              :<span className="search-icon"><SearchIcon/></span>}
            
        </div>
            
        {typeaheadData.length !== 0 && (<div className="users">
          {typeaheadData.slice(0, 6).map((value, key) => {
            return <a 
                    key={key}
                    className="single-user"
                    href={value.html_url}
                    target="_blank"
                    >
                      <img src={value.avatar_url} alt="avatar"/>
                      <p>{value.login}</p>
                    </a>
          })}
        </div>)}

        {error && 
        <h3 className="single-user">{error}</h3>}

        {typeaheadData.length === 0 && inputValue &&
        <h3 className="single-user">Not Found</h3>}

          
        
    </div>
  )
}

export default Search