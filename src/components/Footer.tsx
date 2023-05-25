// import React from 'react';

function Footer() {
    return (
        <div className="py-5 text-center">
            <p className="text-sm mt-2 opacity-50">
                <a 
                    href="https://www.linkedin.com/in/brennan-goins/" 
                    target="_blank"
                    rel="noreferrer"
                >
                    <u> Connect with Me on LinkedIn </u>
                </a> 
                <br></br> 
                &copy; {new Date().getFullYear()} Brennan Goins. All rights reserved.
            </p>
        </div>
    )
}

export default Footer;