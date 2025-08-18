import React from 'react'
import LiberiaCover from './Magazine/LiberiaCover';
import LiberiaGrid from './Magazine/LiberiaGrid';
import LiberiaAbout from './Magazine/LiberiaAbout';
import TmBlogs from './Magazine/tmblogs/TmBlogs';
import MagazineNavbar from './Magazine/MagazineNavbar';
import Card from './Magazine/tmblogs/Card';

const Magazine = () => {
  return (
    <div className='bg-gray-50'>
       <MagazineNavbar/>
      <LiberiaCover/>
      <Card/>
      {/* about tm  */}
      <LiberiaAbout/>
      {/* featured article  */}
      <LiberiaGrid />
      <TmBlogs/>
      <Card/>
    </div>
  )
}

export default Magazine
