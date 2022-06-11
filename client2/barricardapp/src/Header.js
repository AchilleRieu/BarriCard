import React from 'react'

//import Navigation from './Navigation'
//simport {Link} from 'react-router-dom'

function Header(){
    return (
        <header className="border-b p-3 flex justify-between items-center">
            <div > Barricity </div>
            <ul class="nav justify-content-center">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="<Transfer/>">Active</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Link</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link disabled">Disabled</a>
                </li>
            </ul>
           
        </header>
    )
}

export default Header