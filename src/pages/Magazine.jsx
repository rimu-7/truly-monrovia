import React from 'react'
import LiberiaCover from './Magazine/LiberiaCover';
import LiberiaGrid from './Magazine/LiberiaGrid';
import LiberiaAbout from './Magazine/LiberiaAbout';

const Magazine = () => {
  return (
    <div>
      <LiberiaCover/>
      {/* about tm  */}
      <LiberiaAbout/>
      {/* featured article  */}
      <LiberiaGrid />
    </div>
  )
}

export default Magazine
