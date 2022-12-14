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
import androidx.recyclerview.widget.RecyclerView;

import com.example.chatbot.R;
import com.example.chatbot.model.ModelContext;
import com.example.chatbot.ui.adapter.HomeAdapter;
import com.example.chatbot.ui.common.OnItemClickListener;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;
import java.net.URISyntaxException;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

public class HomeFragment extends Fragment {

    private final String URL_SERVER = "http://192.168.1.25:3000/";
    private Socket mSocket;
    private Boolean isadmin = false;

    {
        try {
            mSocket = IO.socket(URL_SERVER);
            Log.d(TAG, "connect");

        } catch (URISyntaxException e) {
            Log.d(TAG, "No connect");
            e.printStackTrace();
        }
    }

    private ModelContext[] modelContexts;

    private Emitter.Listener onContext = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    JSONArray contextlist;
                    String status;
                    try {
                        contextlist = data.getJSONArray("data");
                        status = data.getString("status");
                    } catch (JSONException e) {
                        return;
                    }

                    // add the message to view
                    if (status.equals("true")) {
                        modelContexts = new ModelContext[contextlist.length()];
                        isadmin = false;
                        for(int i =0; i< contextlist.length();i++)
                        {
                            try {
                                JSONObject context = contextlist.getJSONObject(i);
                                JSONArray sugg = context.getJSONArray("suggested");
                                String[] sug = new String[sugg.length()];
                                for (int j =0; j<sugg.length();j++){
                                    sug[j]= sugg.getString(j);
                                }
                                ModelContext model = new ModelContext(context.getString("_id"),
                                        context.getString("userid"),context.getString("adminid"), sug);
                                if(isadmin ==false){if(!model.getAdminid().equals("")) isadmin = true;}
                                modelContexts[i] = model;
                                Log.d("hello", model.getId());


                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                        OnItemClickListener<ModelContext> onClickListener = (view, context) -> {
                            Toast.makeText(getActivity().getApplicationContext(), context.getId(),
                                    Toast.LENGTH_LONG).show();
                            Intent intent = new Intent(getActivity(),ChatActivity.class);
                            intent.putExtra("context", (Serializable) context);
                            startActivity(intent);
                        };
                        OnItemClickListener<ModelContext> onDelete = (view, context)->{
                            Toast.makeText(getActivity().getApplicationContext(),"X??a th??nh c??ng",
                                    Toast.LENGTH_LONG).show();
                            mSocket.emit("delete_context", context.getId(),context.getUserid());
                        };
                        RecyclerView recyclerView = getActivity().findViewById(R.id.rclViewChat);
                        HomeAdapter homeAdapter = new HomeAdapter(modelContexts, onClickListener,onDelete);
                        recyclerView.setAdapter(homeAdapter);
                    }
                    else Toast.makeText(getActivity().getApplicationContext(), "kh??ng c?? context",
                            Toast.LENGTH_LONG).show();

                }
            });
        }
    };

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_home, container, false);
        FloatingActionButton button = root.findViewById(R.id.home_fab_add_product);
        View layout = root.findViewById(R.id.menu_home);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SetVisibility(layout);
            }
        });
        Intent intent = getActivity().getIntent();
        String id = intent.getStringExtra("id");
        mSocket.connect();
        mSocket.emit("get_context",id);
        mSocket.on("data_context", onContext);

        TextView addadmin = root.findViewById(R.id.textview_add_admin);
        TextView addbot = root.findViewById(R.id.textview_add_bot);

        addadmin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SetVisibility(layout);
                if (isadmin == false) mSocket.emit("add_admin",id);
                else Toast.makeText(getActivity().getApplicationContext(),"Chat admin ch??? ???????c t???o 1 l???n",Toast.LENGTH_LONG).show();
            }
        });
        addbot.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                SetVisibility(layout);
                mSocket.emit("add_bot",id);
            }
        });



        return root;
    }

    void SetVisibility(View view)
    {
        if (view.getVisibility()== View.INVISIBLE)
            view.setVisibility(View.VISIBLE);
        else view.setVisibility(View.INVISIBLE);
    }

    @Override
    public void onPause() {
        super.onPause();
        mSocket.disconnect();
    }
}
