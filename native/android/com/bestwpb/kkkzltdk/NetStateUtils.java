package com.bestwpb.kkkzldmgdy;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Enumeration;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.BatteryManager;
import android.telephony.PhoneStateListener;
import android.telephony.SignalStrength;
import android.telephony.TelephonyManager;
import android.util.Log;

public class NetStateUtils {

	
    /**
     * �жϵ�ǰ�����Ƿ����ƶ�����
     *
     * @param context
     * @return boolean
     */
    public static boolean is3G(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetInfo = connectivityManager.getActiveNetworkInfo();
        if (activeNetInfo != null
                && activeNetInfo.getType() == ConnectivityManager.TYPE_MOBILE) {
            return true;
        }
        return false;
    }

    /**
     * �жϵ�ǰ�����Ƿ���wifi����
     *
     * @param context
     * @return boolean
     */
    public static boolean isWifi(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetInfo = connectivityManager.getActiveNetworkInfo();
        if (activeNetInfo != null
                && activeNetInfo.getType() == ConnectivityManager.TYPE_WIFI) {
            return true;
        }
        return false;
    }

    /**
     * �жϵ�ǰ�����Ƿ���2G����
     *
     * @param context
     * @return boolean
     */
    public static boolean is2G(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetInfo = connectivityManager.getActiveNetworkInfo();
        if (activeNetInfo != null
                && (activeNetInfo.getSubtype() == TelephonyManager.NETWORK_TYPE_EDGE
                || activeNetInfo.getSubtype() == TelephonyManager.NETWORK_TYPE_GPRS || activeNetInfo
                .getSubtype() == TelephonyManager.NETWORK_TYPE_CDMA)) {
            return true;
        }
        return false;
    }

    /**
     * wifi�Ƿ��
     */
    public static boolean isWifiEnabled(Context context) {
        ConnectivityManager mgrConn = (ConnectivityManager) context
                .getSystemService(Context.CONNECTIVITY_SERVICE);
        TelephonyManager mgrTel = (TelephonyManager) context
                .getSystemService(Context.TELEPHONY_SERVICE);
        return ((mgrConn.getActiveNetworkInfo() != null && mgrConn
                .getActiveNetworkInfo().getState() == NetworkInfo.State.CONNECTED) || mgrTel
                .getNetworkType() == TelephonyManager.NETWORK_TYPE_UMTS);
    }

    
    public static void getBatteryLevel(Context context){
    	TelephonyManager mTelephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
    	PhoneStateListener phoneStateListener = new PhoneStateListener() {  
    		  
            @Override  
            public void onSignalStrengthsChanged(SignalStrength signalStrength) {  
                // TODO Auto-generated method stub  
                super.onSignalStrengthsChanged(signalStrength);  
                StringBuffer sb = new StringBuffer();  
                String strength = String.valueOf(signalStrength  
                        .getGsmSignalStrength());  
              
            }  
  
        };  
    	 
    	    
    	//�����ź�ǿ��
        mTelephonyManager.listen(phoneStateListener, PhoneStateListener.LISTEN_SIGNAL_STRENGTHS);
    }
    
    
   
    
    
    /**
     * �ж��Ƿ�����������
     *
     * @param context
     * @return
     */
    public static boolean isNetworkConnected(Context context) {
        if (context != null) {
            // ��ȡ�ֻ��������ӹ������(������wi-fi,net�����ӵĹ���)
            ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context
                    .CONNECTIVITY_SERVICE);
            // ��ȡNetworkInfo����
            NetworkInfo networkInfo = manager.getActiveNetworkInfo();
            //�ж�NetworkInfo�����Ƿ�Ϊ��
            if (networkInfo != null)
                return networkInfo.isAvailable();
        }
        return false;
    }

    
    public static void  getBattery(Context context) {
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_BATTERY_CHANGED);
        context.registerReceiver(mBroadcastReceiver, filter);
    }


	private static BroadcastReceiver mBroadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (action.equals(Intent.ACTION_BATTERY_CHANGED)) {
                int status = intent.getIntExtra("status", 0);
                int health = intent.getIntExtra("health", 0);
                boolean present = intent.getBooleanExtra("present", false);
                int level = intent.getIntExtra("level", 0);
                int scale = intent.getIntExtra("scale", 0);
                Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.getBatteryLeve('"+ level +"')");
                int icon_small = intent.getIntExtra("icon-small", 0);
                int plugged = intent.getIntExtra("plugged", 0);
                int voltage = intent.getIntExtra("voltage", 0);
                int temperature = intent.getIntExtra("temperature", 0);
                String technology = intent.getStringExtra("technology");

                String statusString = "";
                switch (status) {
                    case BatteryManager.BATTERY_STATUS_UNKNOWN:
                        statusString = "unknown";
                        break;
                    case BatteryManager.BATTERY_STATUS_CHARGING:
                        statusString = "charging";
                        break;
                    case BatteryManager.BATTERY_STATUS_DISCHARGING:
                        statusString = "discharging";
                        break;
                    case BatteryManager.BATTERY_STATUS_NOT_CHARGING:
                        statusString = "not charging";
                        break;
                    case BatteryManager.BATTERY_STATUS_FULL:
                        statusString = "full";
                        break;
                }

                String healthString = "";
                switch (health) {
                    case BatteryManager.BATTERY_HEALTH_UNKNOWN:
                        healthString = "unknown";
                        break;
                    case BatteryManager.BATTERY_HEALTH_GOOD:
                        healthString = "good";
                        break;
                    case BatteryManager.BATTERY_HEALTH_OVERHEAT:
                        healthString = "overheat";
                        break;
                    case BatteryManager.BATTERY_HEALTH_DEAD:
                        healthString = "dead";
                        break;
                    case BatteryManager.BATTERY_HEALTH_OVER_VOLTAGE:
                        healthString = "voltage";
                        break;
                    case BatteryManager.BATTERY_HEALTH_UNSPECIFIED_FAILURE:
                        healthString = "unspecified failure";
                        break;
                }

                String acString = "";

                switch (plugged) {
                    case BatteryManager.BATTERY_PLUGGED_AC:
                        acString = "plugged ac";
                        break;
                    case BatteryManager.BATTERY_PLUGGED_USB:
                        acString = "plugged usb";
                        break;
                }
                String s = "״̬:" + statusString + "\n"
                        + "����:" + healthString + "\n"
                        + "�Ƿ���ڵ��:" + String.valueOf(present) + "\n"
                        + "��õ�ǰ����:" + String.valueOf(level) + "\n"
                        + "����ܵ���:" + String.valueOf(scale) + "\n"
                        + "ͼ��ID:" + String.valueOf(icon_small) + "\n"
                        + "���ӵĵ�Դ����:" + acString + "\n"
                        + "��ѹ:" + String.valueOf(voltage) + "\n"
                        + "�¶�:" + String.valueOf(temperature) + "\n"
                        + "�������:" + technology + "\n";
                
            }
        }
    };


    
    private class BatteryReceiver extends BroadcastReceiver{
        @Override
        public void onReceive(Context context, Intent intent) {
          int current=intent.getExtras().getInt("level");//��õ�ǰ����
          int total=intent.getExtras().getInt("scale");//����ܵ���
          int percent=current*100/total;
        
        }
      }
    /**
     * �ж�MOBILE�����Ƿ����
     *
     * @param context
     * @param context
     * @return
     */
    public static boolean isMobileConnected(Context context) {
        if (context != null) {
            //��ȡ�ֻ��������ӹ������(������wi-fi,net�����ӵĹ���)
            ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context
                    .CONNECTIVITY_SERVICE);
            //��ȡNetworkInfo����
            NetworkInfo networkInfo = manager.getActiveNetworkInfo();
            //�ж�NetworkInfo�����Ƿ�Ϊ�� ���������Ƿ�ΪMOBILE
            if (networkInfo != null && networkInfo.getType() == ConnectivityManager.TYPE_MOBILE)
                return networkInfo.isAvailable();
        }
        return false;
    }



    /**
     * ��ȡ��ǰ�������ӵ�������Ϣ
     * ԭ��
     *
     * @param context
     * @return
     */
    public static int getConnectedType(Context context) {
        if (context != null) {
            //��ȡ�ֻ��������ӹ������
            ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context
                    .CONNECTIVITY_SERVICE);
            //��ȡNetworkInfo����
            NetworkInfo networkInfo = manager.getActiveNetworkInfo();
            if (networkInfo != null && networkInfo.isAvailable()) {
                //����NetworkInfo������
                return networkInfo.getType();
            }
        }
        return -1;
    }

    /**
     * ��ȡ��ǰ������״̬ ��û������-0��WIFI����1��4G����-4��3G����-3��2G����-2
     * �Զ���
     *
     * @param context
     * @return
     */
    public static int getAPNType(Context context) {
        //�������ֵ
        int netType = 0;
        //��ȡ�ֻ��������ӹ������
        ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context
                .CONNECTIVITY_SERVICE);
        //��ȡNetworkInfo����
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();
        //NetworkInfo����Ϊ�� �����û������
        if (networkInfo == null) {
            return netType;
        }
        //���� NetworkInfo����Ϊ�� ���ȡ��networkInfo������
        int nType = networkInfo.getType();
        if (nType == ConnectivityManager.TYPE_WIFI) {
            //WIFI
            netType = 5;
        } else if (nType == ConnectivityManager.TYPE_MOBILE) {
            int nSubType = networkInfo.getSubtype();
            TelephonyManager telephonyManager = (TelephonyManager) context.getSystemService
                    (Context.TELEPHONY_SERVICE);
            //3G   ��ͨ��3GΪUMTS��HSDPA ���ŵ�3GΪEVDO
            if (nSubType == TelephonyManager.NETWORK_TYPE_1xRTT
                    && !telephonyManager.isNetworkRoaming()) {
                netType = 2;
            } else if (nSubType == TelephonyManager.NETWORK_TYPE_UMTS
                    || nSubType == TelephonyManager.NETWORK_TYPE_HSDPA
                    || nSubType == TelephonyManager.NETWORK_TYPE_EVDO_0
                    && !telephonyManager.isNetworkRoaming()) {
                netType = 1;
                //2G �ƶ�����ͨ��2GΪGPRS��EGDE�����ŵ�2GΪCDMA
            } else if (nSubType == TelephonyManager.NETWORK_TYPE_GPRS
                    || nSubType == TelephonyManager.NETWORK_TYPE_EDGE
                    || nSubType == TelephonyManager.NETWORK_TYPE_CDMA
                    && !telephonyManager.isNetworkRoaming()) {
                netType = 3;
            } else {
                netType = 3;
            }
        }
        return netType;
    }

    /**
     * �ж�GPS�Ƿ��
     * ACCESS_FINE_LOCATIONȨ��
     *
     * @param context
     * @return
     */
    public static boolean isGPSEnabled(Context context) {
        //��ȡ�ֻ���������LOCATION_SERVICE����
        LocationManager locationManager = ((LocationManager) context.getSystemService(Context
                .LOCATION_SERVICE));
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
    }

    /**
     * ��ñ���ip��ַ
     *
     * @return
     */
    public static String GetHostIp() {
        try {
            for (Enumeration<NetworkInterface> en = NetworkInterface
                    .getNetworkInterfaces(); en.hasMoreElements(); ) {
                NetworkInterface intf = en.nextElement();
                for (Enumeration<InetAddress> ipAddr = intf.getInetAddresses(); ipAddr
                        .hasMoreElements(); ) {
                    InetAddress inetAddress = ipAddr.nextElement();
                    if (!inetAddress.isLoopbackAddress()) {
                        return inetAddress.getHostAddress();
                    }
                }
            }
        } catch (SocketException ex) {
        } catch (Exception e) {
        }
        return null;
    }

    /**
     * ��ȡ��������imei
     *
     * @param context
     * @return
     */
    public static String getIMEI(Context context) {
        TelephonyManager telephonyManager = (TelephonyManager) context
                .getSystemService(Context.TELEPHONY_SERVICE);
        return telephonyManager.getDeviceId();
    }

    /***
     * �ж��Ƿ����������ӣ���ͨ���������ж������������Ƿ����ӣ����������Ͼ�������
     *
     * @return
     */

    public static final boolean ping() {

        String result = null;
        try {
            String ip = "www.baidu.com";// ping �ĵ�ַ�����Ի����κ�һ�ֿɿ�������
            Process p = Runtime.getRuntime().exec("ping -c 3 -w 100 " + ip);// ping��ַ3��
            // ��ȡping�����ݣ����Բ���
            InputStream input = p.getInputStream();
            BufferedReader in = new BufferedReader(new InputStreamReader(input));
            StringBuffer stringBuffer = new StringBuffer();
            String content = "";
            while ((content = in.readLine()) != null) {
                stringBuffer.append(content);
            }
            Log.d("------ping-----", "result content : " + stringBuffer.toString());
            // ping��״̬
            int status = p.waitFor();
            if (status == 0) {
                result = "success";
                return true;
            } else {
                result = "failed";
            }
        } catch (IOException e) {
            result = "IOException";
        } catch (InterruptedException e) {
            result = "InterruptedException";
        } finally {
            Log.d("----result---", "result = " + result);
        }
        return false;

    }
}
