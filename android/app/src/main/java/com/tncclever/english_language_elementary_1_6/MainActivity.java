package com.tncclever.english_language_elementary_1_6;

import android.os.Bundle; // react-native-bootsplash

import com.facebook.react.ReactActivity;
import com.zoontek.rnbootsplash.RNBootSplash; // react-native-bootsplash

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "englishlanguageelementary16";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this); // react-native-bootsplash
  }
}
