import { useState } from 'react';

function Search( {setData , setLanguage} ) {
    const [search, setSearch] = useState('');

    const onSearch = async (event) => {
        event.preventDefault();
        setData(search)
    }

    return (
        <form className="d-flex" role="search"  onSubmit={onSearch}>
            <input 
                className="form-control me-2" 
                type="search" 
                placeholder={ setLanguage === "TH" ? "กรอกชื่อค้นหา" : "Search"}
                aria-label={ setLanguage === "TH" ? "ค้นหา" : "Search"}
                onChange={e => setSearch(e.target.value)} 
                value={search} 
            />
            <button className="btn btn-outline-success" type="submit">{ setLanguage === "TH" ? "ค้นหา" : "Search"}</button>
        </form>
    );
}

export default Search;
