import { useState, useEffect } from 'react'
import { addDoc, collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import DatePicker from './DatePicker'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import {
  capitalizeFirstLetter,
  dateIsValid,
} from '../helpers/helperFunctions.js'

function AddMatch() {
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState(null)
  const [formData, setFormData] = useState({
    is_draw: true,
    loser: '',
    winner: '',
    away_team_goals: 0,
    home_team_goals: 0,
  })

  const onSubmitAdmin = async (e) => {
    if (!formData.away_team_id || !formData.home_team_id || !formData.time)
      return toast.error(`provide all team's info`)

    e.preventDefault()
    setLoading(true)
    try {
      formData.group =
        formData.away_team_group === formData.home_team_group
          ? formData.home_team_group
          : ''
      await addDoc(collection(db, 'matches'), formData)
      setLoading(false)
      toast.success('Match saved')
      setFormData({
        is_draw: true,
        loser: '',
        winner: '',
        away_team_goals: 0,
        home_team_goals: 0,
      })
    } catch (error) {
      toast.error('Could not add new team')
    }
  }

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        //Get reference to the collection
        const teamsRef = collection(db, 'teams')

        //create query
        const q = query(teamsRef, orderBy('group', 'asc'))

        //execute query
        const querySnap = await getDocs(q)

        const teams = []
        querySnap.forEach((doc) => {
          //   return teams.push({ id: doc.id, data: doc.data() })
          let {
            data: { country, flag_url, group, sm_flag_url },
          } = { data: doc.data() }

          return teams.push({
            id: doc.id,
            label: capitalizeFirstLetter(country),
            flag_url,
            sm_flag_url,
            group,
          })
        })

        setTeams(teams)
        setLoading(false)
      } catch (error) {
        toast.error('could not fetch matches')
      }
    }
    fetchTeams()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <div className='profileDetailsHeader'>
        <p className='profileDetailsText'>Matches</p>
      </div>
      <div className='adminCard'>
        <form className='addMatchForm'>
          <Autocomplete
            id='home_team'
            options={teams ? teams : []}
            sx={{ width: 245, margin: '1rem' }}
            renderInput={(params) => (
              <TextField {...params} label='Home Team' />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, teamSelected) =>
              setFormData((prevState) => ({
                ...prevState,
                home_team_id: teamSelected ? teamSelected.id : null,
                home_team_flag_url: teamSelected ? teamSelected.flag_url : null,
                home_team_sm_flag_url: teamSelected
                  ? teamSelected.sm_flag_url
                  : null,
                home_team_group: teamSelected ? teamSelected.group : null,
                home_team: teamSelected ? teamSelected.label : null,
              }))
            }
          />

          <Autocomplete
            id='away_team'
            options={teams ? teams : []}
            sx={{ width: 245 }}
            renderInput={(params) => (
              <TextField {...params} label='Away Team' />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, teamSelected) =>
              setFormData((prevState) => ({
                ...prevState,
                away_team_id: teamSelected ? teamSelected.id : null,
                away_team_flag_url: teamSelected ? teamSelected.flag_url : null,
                away_team_sm_flag_url: teamSelected
                  ? teamSelected.sm_flag_url
                  : null,
                away_team_group: teamSelected ? teamSelected.group : null,
                away_team: teamSelected ? teamSelected.label : null,
              }))
            }
          />

          <DatePicker setFormData={setFormData} />
        </form>
        <button
          onClick={onSubmitAdmin}
          disabled={
            !formData.home_team_id ||
            !formData.away_team_id ||
            dateIsValid(formData.time) === false
          }
          className={
            formData.home_team_id &&
            formData.away_team_id &&
            dateIsValid(formData.time) === true
              ? 'submit'
              : 'submitDisabled'
          }
        >
          Submit
        </button>
      </div>
    </>
  )
}

export default AddMatch
