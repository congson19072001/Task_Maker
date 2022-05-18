import React from 'react'

/** Todolist
 * Create comyright, logo of company and
 * brand name
 * No need for antd
*/
const AppFooter = () => {
    return (
        <div className="cuoi">
            <h2>Copyright &copy; 2021 by CongSon</h2>
                <img src={process.env.PUBLIC_URL+'/taskmaker.png'} alt="Logo" height="100"/>
        </div>
    )
}

export default AppFooter
