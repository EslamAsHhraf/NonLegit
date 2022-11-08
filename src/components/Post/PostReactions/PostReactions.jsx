import { useState } from 'react';

// icons
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';

// mui components
import {
  Box, ClickAwayListener, Divider, IconButton, ListItemButton, ListItemIcon, useMediaQuery,
} from '@mui/material';

// styles
import { useTheme } from '@mui/system';
import {
  PostActions, ActionButton, ShowMoreList, ShowMoreListItemText,
} from './styles';
import Reactions from '../Reactions/Reactions';

/**
 * This component is the container of post reactions
 *
 * @component PostReactions
 * @property {number} votes -Number of post votes.
 * @property {boolean} matchMd -check whether screen size is larger than meduim
 * @property {boolean} matchSm -check whether screen size is larger than small
 * @property {number} commentCount -Number of post comments.
 * @returns {React.Component}  All post reactions.
 */

function PostReactions(props) {
  const {
    matchSm, comments, matchMd, votes,
  } = props;

  const [showMore, setShowMore] = useState(false);
  const [save, setSave] = useState(false);
  const theme = useTheme();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const matchXxs = useMediaQuery(theme.breakpoints.down('xxs'));
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  const handleSave = () => setSave(!save);
  const handleClickAway = () => setShowMore(false);
  return (
    <PostActions mt={0.5}>
      {!matchSm && (
      <Reactions flexDirection="row" votes={votes} />
      )}
      <ActionButton
        color="third"
        startIcon={<ChatBubbleOutlineRoundedIcon />}
      >
        {comments}
        {' '}
        comments
      </ActionButton>
      {!matchXs
      && (
      <ActionButton
        color="third"
        startIcon={<ShareOutlinedIcon />}
      >
        Share

      </ActionButton>
      )}
      {matchMd && (
      <ActionButton
        color="third"
        startIcon={save
          ? (
            <BookmarksOutlinedIcon />
          ) : (
            <BookmarkBorderIcon
              sx={{
                width: '25px !important',
                height: '25px !important',
              }}
            />

          )}
        onClick={handleSave}
        data-testid="save button"
      >
        {save ? 'Unsave' : 'Save'}
      </ActionButton>
      )}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box position="relative" display="flex">
          <IconButton
            sx={{
              borderRadius: '10%',
              py: 0.4,
            }}
            onClick={handleShowMore}
            color="third"
          >
            <MoreHorizOutlinedIcon />
          </IconButton>

          <ShowMoreList
            sx={{ boxShadow: 2 }}
            display={(showMore === false ? 'none' : 'block')}
            match={matchXxs}
          >
            {matchXs && (
            <>
              <ListItemButton onClick={handleSave}>
                <ListItemIcon>
                  <ShareOutlinedIcon />
                </ListItemIcon>
                <ShowMoreListItemText>
                  Share
                </ShowMoreListItemText>
              </ListItemButton>
              <Divider />
            </>
            )}
            {!matchMd && (
            <>
              <ListItemButton onClick={handleSave}>
                <ListItemIcon>
                  {save ? <BookmarksOutlinedIcon /> : <BookmarkBorderIcon />}
                </ListItemIcon>
                <ShowMoreListItemText>
                  {save ? 'Unsave' : 'Save'}
                </ShowMoreListItemText>
              </ListItemButton>
              <Divider />
            </>
            )}
            <ListItemButton>
              <ListItemIcon>
                <VisibilityOffOutlinedIcon />
              </ListItemIcon>
              <ShowMoreListItemText>
                hide
              </ShowMoreListItemText>
            </ListItemButton>
            <Divider />
            <ListItemButton>
              <ListItemIcon>
                <FlagOutlinedIcon />
              </ListItemIcon>
              <ShowMoreListItemText>
                report
              </ShowMoreListItemText>
            </ListItemButton>
          </ShowMoreList>
        </Box>
      </ClickAwayListener>
    </PostActions>
  );
}

export default PostReactions;
