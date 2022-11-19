export default function MatchResultModal({ onClose, realMatchResult }) {
  return (
    <>
      {' '}
      <div className='backgroundOverlay' onMouseDown={onClose}>
        <div
          className='modalContainer'
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className='scoreCardModal'>
            <div className='scoreCardHeaderModal'>Match Result</div>

            <div className='scoreCardBodyModal'>
              <div className='teamInfoModal'>
                <p className='teamNameModal'>{realMatchResult.home_team}</p>
                <div className='flagScoreContainerModal'>
                  <img
                    className='team_flag_img'
                    src={realMatchResult.home_team_sm_flag_url}
                    alt='flag'
                  />
                  <input
                    type='number'
                    id='home_score'
                    className={'homeScore'}
                    disabled={true}
                    value={realMatchResult.home_team_goals}
                    maxLength='4'
                  />
                </div>
              </div>
              <div className='teamInfoModal'>
                <p className='teamNameModal'>{realMatchResult.away_team}</p>
                <div className='flagScoreContainerModal'>
                  <input
                    type='number'
                    id='away_score'
                    className={'awayScore'}
                    disabled={true}
                    value={realMatchResult.away_team_goals}
                    maxLength='4'
                  />
                  <img
                    className='team_flag_img'
                    src={realMatchResult.away_team_sm_flag_url}
                    alt='flag'
                  />
                </div>
              </div>
            </div>
            <div className='betCardButtonContainer'>
              <button
                onClick={() => {
                  onClose()
                }}
                type='button'
                className='logOut buttonOutline'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
