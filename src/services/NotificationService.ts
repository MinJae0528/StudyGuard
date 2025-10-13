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
   * 로컬 알림 권한 요청 (푸시 알림 없이)
   */
  static async registerForPushNotificationsAsync(): Promise<boolean> {
    try {
      // 먼저 현재 권한 상태 확인
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      // 이미 권한이 있으면 채널만 설정하고 반환
      if (existingStatus === "granted") {
        // Android에서 알림 채널 설정
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "StudyGuard 알림",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#001F3F",
            sound: "default",
          });
        }
        return true;
      }

      // Android에서 알림 채널 설정 (권한 요청 전)
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "StudyGuard 알림",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#001F3F",
          sound: "default",
        });
      }

      // 권한 요청
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("알림 권한이 거부되었습니다.");
        return false;
      }

      console.log("알림 권한이 승인되었습니다! 🎉");
      return true;
    } catch (error) {
      console.error("알림 권한 요청 오류:", error);
      return false;
    }
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
