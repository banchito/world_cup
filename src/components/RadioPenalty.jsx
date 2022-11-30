import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'

export default function RadioPenalty({
  away_team,
  away_team_id,
  home_team,
  home_team_id,
  onChangePenaltyWinner,
  pkWinner,
  disabled,
  updateScoreAdmin,
}) {
  return (
    <>
      <FormControl disabled={disabled}>
        <RadioGroup row value={pkWinner} onChange={onChangePenaltyWinner}>
          <FormControlLabel
            control={
              <Radio
                style={{
                  color: disabled ? '' : '#00cc66',
                  marginRight: '.5rem',
                }}
              />
            }
            label={home_team}
            value={home_team_id}
            id={'pkWinner'}
            labelPlacement='start'
          />
          <FormControlLabel
            control={
              <Radio
                style={{
                  color: disabled ? '' : '#00cc66',
                  marginLeft: '.5rem',
                }}
              />
            }
            label={away_team}
            value={away_team_id}
            id={'pkWinner'}
            labelPlacement='end'
          />
          {/* {updateScoreAdmin && (
            <FormControlLabel
              control={
                <Radio
                  style={{
                    color: disabled ? '' : '#00cc66',
                  }}
                />
              }
              label={'None'}
              value={'none'}
              id={'pkWinner'}
              labelPlacement='start'
            />
          )} */}
        </RadioGroup>
      </FormControl>
    </>
  )
}
