package com.example.chatbot.ui.home;

import static android.content.ContentValues.TAG;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.chatbot.R;
import com.example.chatbot.model.ModelUser;
import com.google.android.material.appbar.MaterialToolbar;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class ProfileFragment extends Fragment {

    private final String URL_SERVER = "http://192.168.1.21:3000/";
    private Socket mSocket;
    private ModelUser user;

    {
        try {
            mSocket = IO.socket(URL_SERVER);
            Log.d(TAG, "connect");

        } catch (URISyntaxException e) {
            Log.d(TAG, "No connect");
            e.printStackTrace();
        }
    }

    private Emitter.Listener onUser = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    JSONObject userlist;
                    try {
                        userlist = data.getJSONObject("data");
                        user = new ModelUser(userlist.getString("_id"),userlist.getString("name"),
                                userlist.getString("phone"),userlist.getString("mail"),userlist.getString("pass"));
                        Toast.makeText(getActivity().getApplicationContext(),"user id" + userlist.getString("_id"),Toast.LENGTH_LONG).show();
                        TextView name = getView().findViewById(R.id.profile_name_tv);
                        name.setText(user.getName());
                        TextView phone = getView().findViewById(R.id.profile_mobile_tv);
                        phone.setText(user.getPhone());
                        TextView mail = getView().findViewById(R.id.profile_email_tv);
                        mail.setText(user.getMail());
                    } catch (JSONException e) {
                        return;
                    }
                    // add the message to view
                }
            });
        }
    };

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_profile, container, false);
        mSocket.connect();
        Intent intent = getActivity().getIntent();
        String userid = intent.getStringExtra("id");
        mSocket.emit("user_profile",userid);
        mSocket.on("data_profile_user",onUser);

        MaterialToolbar toolbar = root.findViewById(R.id.profile_top_app_bar);
        toolbar.setTitle("Hồ sơ");
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mSocket.disconnect();
                Fragment fragment = new AccountFragment();
                FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.nav_host_fragment,fragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });

        return root;
    }

    @Override
    public void onPause() {
        super.onPause();
        mSocket.disconnect();
    }
}
