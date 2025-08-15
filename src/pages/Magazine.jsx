import React from 'react'
import LiberiaCover from './Magazine/LiberiaCover';
import LiberiaGrid from './Magazine/LiberiaGrid';
import LiberiaAbout from './Magazine/LiberiaAbout';
import MagNav from './Magazine/MagNav';
import Musics from './Magazine/categories/Musics';

const Magazine = () => {
  return (
    <div>
       {/* <MagNav /> */}
      <LiberiaCover/>
      {/* about tm  */}
      <LiberiaAbout/>
      {/* featured article  */}
      <LiberiaGrid />
      <Musics/>
    </div>
  )
}

export default Magazine
