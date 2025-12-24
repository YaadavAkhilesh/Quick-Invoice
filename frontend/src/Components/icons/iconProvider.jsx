import HomeWorkRounded from "@mui/icons-material/HomeWorkRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import EmailRounded from "@mui/icons-material/EmailRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import BusinessCenterRounded from "@mui/icons-material/BusinessCenterRounded";
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import DrawRounded from '@mui/icons-material/DrawRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import SettingsRounded from '@mui/icons-material/SettingsRounded';
import HomeRounded from '@mui/icons-material/HomeRounded';
import AccountCircleRounded from "@mui/icons-material/AccountCircleRounded";
import DeleteRounded from '@mui/icons-material/DeleteRounded';
import DashBoardROunded from '@mui/icons-material/SpaceDashboardRounded';
import RightArrowIcon from '@mui/icons-material/EastSharp';
import StarFullRounded from '@mui/icons-material/StarRounded';
import StarHalfRounded from '@mui/icons-material/StarHalfRounded';
import StarBorderRounded from '@mui/icons-material/StarBorderRounded';
import PasswordRounded from '@mui/icons-material/PasswordRounded';
import ErrorRounded from '@mui/icons-material/ErrorRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import eyeopenrounded from '@mui/icons-material/VisibilityRounded';
import eyecloserounded from '@mui/icons-material/VisibilityOffRounded';
import LeftRounded from '@mui/icons-material/WestRounded';
import RemoveCircleRounded from '@mui/icons-material/RemoveCircleRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ConfirmRounded from '@mui/icons-material/ConfirmationNumberRounded';
import AddLinkRounded from '@mui/icons-material/AddLinkRounded';
import OwnerRounded from '@mui/icons-material/AdminPanelSettingsRounded';

// Reusable HOC for consistent icon styling with override support
const withCustomStyle = (OriginalIcon) => {
  const StyledIcon = ({ sx = {}, ...props }) => (
    <OriginalIcon
      sx={{ color: "var(--brand-secondary-dark-2)", fontSize: 38, ...sx }}
      {...props}
    />
  );
  // Set display name for better debugging
  StyledIcon.displayName = `Styled(${OriginalIcon.displayName || OriginalIcon.name || "Icon"})`;
  return StyledIcon;
};

// Export all styled icons centralized for reuse
export const HomeWorkIcon = withCustomStyle(HomeWorkRounded);
export const HomeRoundedIcon = withCustomStyle(HomeRounded);
export const PersonIcon = withCustomStyle(PersonRounded);
export const UserIconStyled = withCustomStyle(AccountCircleRounded);
export const SettingRoundedIcon = withCustomStyle(SettingsRounded);
export const PhoneIcon = withCustomStyle(PhoneRounded);
export const EmailIcon = withCustomStyle(EmailRounded);
export const LocationIcon = withCustomStyle(LocationOnRounded);
export const BusinessIcon = withCustomStyle(BusinessCenterRounded);
export const ReceiptIcon = withCustomStyle(ReceiptLongRounded);
export const EditIcon = withCustomStyle(DrawRounded);
export const TemplateIcon = withCustomStyle(DescriptionRounded);
export const DocIcon = withCustomStyle(DescriptionRounded);
export const DeleteIcon = withCustomStyle(DeleteRounded);
export const DashboardIcon = withCustomStyle(DashBoardROunded);
export const ArrowRightIcon = withCustomStyle(RightArrowIcon);
export const StarFullIcon = withCustomStyle(StarFullRounded);
export const StarHalfIcon = withCustomStyle(StarHalfRounded);
export const StarBorderIcon = withCustomStyle(StarBorderRounded);
export const PasswordIcon = withCustomStyle(PasswordRounded);
export const ErrorIcon = withCustomStyle(ErrorRounded);
export const CheckCircleIcon = withCustomStyle(CheckCircleRoundedIcon);
export const EyeOpenIcon = withCustomStyle(eyeopenrounded);
export const EyeCloseIcon = withCustomStyle(eyecloserounded);
export const ArrowLeftIcon = withCustomStyle(LeftRounded);
export const RemoveCircleIcon = withCustomStyle(RemoveCircleRounded);
export const CloseIcon = withCustomStyle(CloseRounded);
export const ConfirmIcon = withCustomStyle(ConfirmRounded);
export const AddLinkIcon = withCustomStyle(AddLinkRounded);
export const OwnerIcon = withCustomStyle(OwnerRounded);

// Robust render helper for icon component or image URL
export const renderIcon = (icon, size = 38, custcolor = "var(--brand-secondary-dark-2)") => {
  if (!icon) return null;
  if (typeof icon === "string") {
    return <img src={icon} alt="" style={{ height: size, width: size, objectFit: "contain", color: custcolor }} />;
  }
  const IconComponent = icon;
  return <IconComponent sx={
    { fontSize: size, color: custcolor }
  } />;
};


// Robust rendersize helper for icon component or image URL
export const renderSize = (icon, size = 38) => {
  if (!icon) return null;
  const IconComponent = icon;
  return <IconComponent sx={
    { fontSize: size }
  } />;
};