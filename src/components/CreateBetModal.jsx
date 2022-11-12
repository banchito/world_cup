import React from 'react'

export default function CreateBetModal(props) {
  return (
    <div className='backgroundOverlay' onMouseDown={props.onClose}>
      <div className='modalContainer' onMouseDown={(e) => e.stopPropagation()}>
        <div className='scoreCardModal'>
          <div className='scoreCardHeaderModal'>place your bet</div>
          <div className='scoreCardBodyModal'>
            <div className='teamInfoModal'>
              <img
                className='team_flag_img'
                src={props.info.home_team_sm_flag_url}
                alt='flag'
              />

              <p className='team_goals'>0</p>
            </div>
            <div className='teamInfoModal'>
              <p className='team_goals'>0</p>
              <img
                className='team_flag_img'
                src={props.info.away_team_sm_flag_url}
                alt='flag'
              />
            </div>
          </div>
          <button type='button' className='logOut'>
            Bet
          </button>
        </div>
        {/* <div className='modalButtonsContainer'> */}

        {/* </div> */}
      </div>
    </div>
  )
}
