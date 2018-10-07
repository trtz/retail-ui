import Button from "retail-ui/Button";
import Icon from "retail-ui/Icon";

props => (
  <>
    <Button icon={props.isSuccess ? "EmoticonHappy" : "EmoticonSad"}>
      {props.message}
    </Button>
    <Icon name={props.isHidden ? "EyeClosed" : "EyeOpened"} />
  </>
);
