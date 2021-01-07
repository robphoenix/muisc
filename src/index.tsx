import * as React from 'react'
import Box, { BoxProps } from '@material-ui/core/Box'
import Divider, { DividerProps } from '@material-ui/core/Divider'
import assert from 'assert'
import flattenChildren from 'react-keyed-flatten-children'

type HorizontalAlign = `left` | `right` | `center` | `none`
interface VStackProps extends BoxProps {
  spacing?: number
  align?: HorizontalAlign
  dividers?: boolean
  dividerProps?: Omit<DividerProps, 'orientation'>
}

// TODO: these could prob be hooks?
export const getNegativeMargin = (spacing?: number | Array<number>) => {
  if (spacing === null || spacing === undefined) return

  if (typeof spacing === 'number') return spacing * -1
  return spacing.map((s: number) => s * -1)
}
export const getHorizontalAlignment = (
  align?: HorizontalAlign | HorizontalAlign[]
) => {
  const alignments: {
    none: string
    left: string
    center: string
    right: string
  } = {
    none: `stretch`,
    left: `flex-start`,
    center: `center`,
    right: `flex-end`,
  }
  if (align === null || align === undefined) return
  if (typeof align === `string`) return alignments[align]
  return align.map((a: HorizontalAlign) => alignments[a])
}
export const getVerticalAlignment = (
  align?: VerticalAlign | VerticalAlign[]
) => {
  const alignments: {
    top: string
    bottom: string
    center: string
    baseline: string
  } = {
    top: `flex-start`,
    bottom: `flex-end`,
    center: `center`,
    baseline: `baseline`,
  }
  if (align === null || align === undefined) return
  if (typeof align === `string`) return alignments[align]
  return align.map((a: VerticalAlign) => alignments[a])
}

// TODO: probably need to add React.forwardRef
const VStack: React.FC<VStackProps> = props => {
  const {
    children,
    spacing = 0,
    component = 'div',
    align = 'none',
    dividers = false,
    dividerProps = {},
    ...rest
  } = props

  const validStackComponents = ['div', 'ol', 'ul'] as Array<
    React.ElementType<any>
  >
  assert(
    validStackComponents.includes(component),
    `Invalid VStack component: ${component}`
  )

  const isList = component === 'ol' || component === 'ul'
  const alignItems = getHorizontalAlignment(align)
  const mt = getNegativeMargin(spacing)

  return (
    <Box
      component={component}
      {...rest}
      sx={{
        display: 'flex',
        p: 0,
        listStyle: 'none',
        flexDirection: 'column',
        width: '100%',
        ':before': {
          content: "''",
          display: `block`,
          mt,
        },
      }}
    >
      {React.Children.map(flattenChildren(children), (child, index) => {
        return (
          <Box
            component={isList ? `li` : `div`}
            sx={{
              display: 'flex',
              flexDirection: `column`,
              pt: spacing,
              alignItems,
            }}
          >
            {dividers && index > 0 ? (
              <Box sx={{ width: `100%`, pb: spacing }}>
                <Divider {...dividerProps} />
              </Box>
            ) : null}
            {child}
          </Box>
        )
      })}
    </Box>
  )
}

type VerticalAlign = `top` | `bottom` | `center` | `baseline`
interface HStackProps extends BoxProps {
  spacing?: number | Array<number>
  align?: HorizontalAlign | Array<HorizontalAlign>
  alignY?: VerticalAlign | Array<VerticalAlign>
  dividers?: boolean
  dividerProps?: Omit<DividerProps, 'orientation'>
  wrap?: boolean
}

const HStack: React.FC<HStackProps> = props => {
  const {
    children,
    spacing = 0,
    component = 'div',
    align = `left`,
    alignY = `top`,
    dividers = false,
    dividerProps = {},
    wrap = false,
    ...rest
  } = props

  const validStackComponents = ['div', 'ol', 'ul'] as Array<
    React.ElementType<any>
  >
  assert(
    validStackComponents.includes(component),
    `Invalid HStack component: ${component}`
  )

  const isList = component === 'ol' || component === 'ul'
  const justifyContent = getHorizontalAlignment(align)
  const alignItems = getVerticalAlignment(alignY)
  const mt = getNegativeMargin(spacing)
  const ml = getNegativeMargin(spacing)

  return (
    <Box
      {...rest}
      sx={{
        ':before': {
          content: "''",
          display: `block`,
          mt,
        },
      }}
    >
      <Box
        component={component}
        sx={{
          display: 'flex',
          p: 0,
          listStyle: 'none',
          flexWrap: wrap ? 'wrap' : 'nowrap',
          ml,
          alignItems,
          justifyContent,
        }}
      >
        {React.Children.map(flattenChildren(children), (child, index) => {
          if (child === null || child === undefined) return null
          return (
            <Box
              component={isList ? `li` : `div`}
              sx={{
                display: 'flex',
                alignItems,
                minWidth: 0,
                pl: spacing,
                pt: spacing,
              }}
            >
              {dividers && index > 0 ? (
                <Box sx={{ width: `100%`, pb: spacing }}>
                  <Divider {...dividerProps} orientation="vertical" />
                </Box>
              ) : null}
              {child}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

export { VStack, HStack, VStackProps, HStackProps }
