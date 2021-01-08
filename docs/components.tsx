import * as React from 'react'
import Box, { BoxProps } from '@material-ui/core/Box'

const Wrapper: React.FC = (props) => (
  <Box sx={{ p: 4, backgroundColor: 'grey.100' }} {...props} />
)

const Item: React.FC<Boxprops> = (props) => {
  const { sx, ...rest } = props
  return (
    <Box
      sx={{ height: 48, backgroundColor: 'secondary.light', ...sx }}
      {...rest}
    />
  )
}

export { Wrapper, Item }
