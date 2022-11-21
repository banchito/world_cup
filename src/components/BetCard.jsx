import { useState, useCallback } from 'react'
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { dateToString, matchResult } from '../helpers/helperFunctions'
import MatchResultModal from './MatchResultModal'
import { fetchMatchResults } from '../Context/UserActions'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Avatar from '@mui/material/Avatar'

export default function BetCard({ data, setLoading, id }) {
  const [showModal, setShowModal] = useState(null)
  const [realMatchResult, setRealMatchResult] = useState(null)
  const [score, setScore] = useState({
    home_score: data.home_team_goals,
    away_score: data.away_team_goals,
  })
  const { home_score, away_score } = score
  let matchDate = dateToString(data.matchTime)
 const today = new Date()
 const updateBet = async (matchDate) => {
   if (matchDate < today.getTime() / 1000) {
     return toast.error('Bets are closed for this game')
   }
   setLoading(true)
   const result = matchResult(
     home_score,
     away_score,
     data.away_team_id,
     data.home_team_id
   )

   const updatedBetinfo = {
     away_team_goals: parseInt(away_score),
     home_team_goals: parseInt(home_score),
     is_draw: result.is_draw,
     winner: result.winner,
     loser: result.loser,
     updateTimeStamp: serverTimestamp(),
   }
   try {
     const userBetRef = doc(db, 'user_bet', id)

     await updateDoc(userBetRef, updatedBetinfo)
     setLoading(false)
     toast.success('Chages saved')
   } catch (error) {
     setLoading(false)
     toast.error('Could not update your bet')
   }
 }

 const getRealMatchResults = async (info) => {
   try {
     const matchResult = await fetchMatchResults(info)

     setRealMatchResult(matchResult)
     showMatchBet()
   } catch (error) {
     toast.error('Could Not Get Match')
   }
 }

 const showMatchBet = useCallback(() => {
   setShowModal({
     onClose() {
       setShowModal(null)
     },
   })
 }, [setShowModal])

 const onChange = (e, newValue) => {
   setScore((prevState) => ({
     ...prevState,
     [e.target.name]: newValue,
   }))
 }
 return (
   <>
     {realMatchResult && showModal && (
       <MatchResultModal
         onClose={showModal.onClose}
         realMatchResult={realMatchResult}
         setLoading={setLoading}
       />
     )}
     <div className='scoreGrid'>
       <div className='adminCard'>
         <div className='scoreCardHeader scoreCardHeaderUpdate '>
           {data.isMatchResultUpdated
             ? `Points From This Bet: ${data.points_won}`
             : ` Update Bet Before: ${matchDate}`}
         </div>
         <div className='scoreCardBody'>
           <div className='teamInfoModal'>
             <p className='teamNameModal'>{data.home_team}</p>
             <div className='flagScoreContainerModal'>
               <img
                 className='team_flag_img'
                 src={data.home_team_sm_flag_url}
                 alt='flag'
               />
               <Avatar>{home_score}</Avatar>
             </div>
           </div>
           <div className='teamInfoModal'>
             <p className='teamNameModal'>{data.away_team}</p>
             <div className='flagScoreContainerModal'>
               <Avatar>{away_score}</Avatar>
               <img
                 className='team_flag_img'
                 src={data.away_team_sm_flag_url}
                 alt='flag'
               />
             </div>
           </div>
         </div>
         {data.matchTime.seconds < today / 1000 ? (
           <></>
         ) : (
           <div className='betCardSlider'>
             <Box sx={{ width: 200 }}>
               <Slider
                 style={{ color: '#00cc66' }}
                 aria-label='Score'
                 defaultValue={data.home_team_goals ? data.home_team_goals : 0}
                 name={'home_score'}
                 size={'medium'}
                 valueLabelDisplay='auto'
                 step={1}
                 marks
                 min={0}
                 max={10}
                 onChange={onChange}
               />

               <Slider
                 style={{ color: '#00cc66' }}
                 aria-label='Score'
                 defaultValue={data.away_team_goals ? data.away_team_goals : 0}
                 name={'away_score'}
                 valueLabelDisplay='auto'
                 step={1}
                 marks
                 min={0}
                 max={10}
                 onChange={onChange}
               />
             </Box>
           </div>
         )}
         <div className='betCardButtonContainer'>
           {data.isMatchResultUpdated ? (
             <button
               type='button'
               className='logOut'
               onClick={() => {
                 getRealMatchResults({
                   matchId: data.matchId,
                 })
               }}
             >
               Match Result
             </button>
           ) : (
             <button
               type='button'
               className={
                 //  score.home_score === data.home_team_goals &&
                 //  score.away_score === data.away_team_goals
                 //    ? 'logOut submitDisabled':
                 'logOut'
               }
               onClick={() => updateBet(data.matchTime.seconds)}
             >
               Submit
             </button>
           )}

           <button
             onClick={() => {
               setScore({
                 home_score: data.home_team_goals,
                 away_score: data.away_team_goals,
               })
             }}
             type='button'
             className='logOut buttonOutline'
           >
             Cancel
           </button>
         </div>
       </div>
     </div>
   </>
 )
}
