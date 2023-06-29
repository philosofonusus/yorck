import Avatar from "boring-avatars";

interface IStyledAvatar {
  name: string;
  size?: number;
}

const StyledAvatar: React.FC<IStyledAvatar> = ({ name, size = 40 }) => (
  <Avatar
    size={size}
    name={name}
    variant="marble"
    colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
  />
);

export default StyledAvatar;
