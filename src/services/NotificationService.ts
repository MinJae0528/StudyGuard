import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// 알림 핸들러 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  /**
   * 푸시 알림 권한 요청
   */
  static async registerForPushNotificationsAsync(): Promise<string | null> {
    let token: string | null = null;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return null;
      }

      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: "your-expo-project-id", // 실제 프로젝트 ID로 변경 필요
        });
        token = tokenData.data;
      } catch (error) {
        console.error("Error getting push token:", error);
        return null;
      }
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    return token;
  }

  /**
   * 휴식 복귀 알림 스케줄링
   * @param delaySeconds - 알림을 보낼 지연 시간 (초)
   */
  static async scheduleReturnNotification(
    delaySeconds: number = 300
  ): Promise<string | null> {
    try {
      // 기존 알림 취소
      await this.cancelAllNotifications();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 StudyGuard",
          body: "휴식 시간이 끝났습니다! 다시 공부를 시작해보세요 📚",
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          seconds: delaySeconds,
        },
      });

      console.log(
        `휴식 복귀 알림이 ${delaySeconds}초 후에 예약되었습니다. ID: ${notificationId}`
      );
      return notificationId;
    } catch (error) {
      console.error("알림 스케줄링 오류:", error);
      return null;
    }
  }

  /**
   * 모든 예약된 알림 취소
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("모든 예약된 알림이 취소되었습니다.");
    } catch (error) {
      console.error("알림 취소 오류:", error);
    }
  }

  /**
   * 특정 알림 취소
   * @param notificationId - 취소할 알림 ID
   */
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(`알림이 취소되었습니다. ID: ${notificationId}`);
    } catch (error) {
      console.error("알림 취소 오류:", error);
    }
  }

  /**
   * 즉시 로컬 알림 보내기 (테스트용)
   */
  static async sendImmediateNotification(
    title: string,
    body: string
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
        },
        trigger: null, // 즉시 발송
      });
    } catch (error) {
      console.error("즉시 알림 발송 오류:", error);
    }
  }
}
