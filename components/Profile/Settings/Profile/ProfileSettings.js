import Uploadfile from "../../../Uploadfile";
import styles from "./styles.module.css";
export default function ProfileSettings() {
  return (
    <div>
      <div className={styles.ProfileSettingsContainer}>
        <div className={styles.bio}>
          <h1>Profile</h1>
          <p>
            You update your preferred display name, create your socials URL,
            Banner Image and Profile Image
          </p>
          <div>
            <h4>Account information</h4>

            <div className={styles.accountInfoInputes}>
              <label htmlFor="username">username</label>
              <input name="username" type="text" />
              <label htmlFor="email">Your Email</label>
              <input name="email" type="email" />
              <label htmlFor="ail">Briefly write something about you</label>
              <textarea type="text" />
            </div>
            <div className={styles.socials}>
              <h4>Socials</h4>
              <label htmlFor="twitterlink">Twitter</label>
              <input name="twitterlink" />
              <label htmlFor="telegramlink">Telegram</label>
              <input name="telegramlink" />
              <label htmlFor="discordlink">Discord</label>
              <input name="discordlink" />
              <label htmlFor="facebooklink">Facebook</label>
              <input name="facebooklink" />
            </div>
          </div>
        </div>
        <div className={styles.uploadProfilePicture}>
          <h4>Update profile photo</h4>
          <div className={styles.uploadcontainer}>
            <div className={styles.graycover} />
            <Uploadfile />
          </div>
        </div>
      </div>
      <div className={styles.submitBtn}>Update</div>
    </div>
  );
}
