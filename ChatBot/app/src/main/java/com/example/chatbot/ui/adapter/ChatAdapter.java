package com.example.chatbot.ui.adapter;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;

import com.example.chatbot.R;
import com.example.chatbot.model.ModelMessage;

public class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.ViewHolder> {

    private ModelMessage[] localDataSet;
    private String userid;
    private boolean status;


    /**
     * Provide a reference to the type of views that you are using
     * (custom ViewHolder).
     */
    public static class ViewHolder extends RecyclerView.ViewHolder {
        private final TextView textViewcontent;
        private final ImageView imageView;
        private final View viewitem;

        public ViewHolder(View view) {
            super(view);
            // Define click listener for the ViewHolder's View

            textViewcontent = view.findViewById(R.id.textview_content_message);
            imageView = view.findViewById(R.id.imageAVT);
            viewitem = view;
        }
        public TextView getTextViewcontent() {
            return textViewcontent;
        }
        public ImageView getImageView() {return imageView;}
        public void setlayout(){
            ConstraintLayout constraintLayout = viewitem.findViewById(R.id.layout_mess);
            ConstraintLayout.LayoutParams params = (ConstraintLayout.LayoutParams) constraintLayout.getLayoutParams();
            params.endToEnd = R.id.image;
            params.startToStart = -1;
            constraintLayout.requestLayout();
        }
        public void setlayout1(){
            ConstraintLayout constraintLayout = viewitem.findViewById(R.id.layout_mess);
            ConstraintLayout.LayoutParams params = (ConstraintLayout.LayoutParams) constraintLayout.getLayoutParams();
            params.startToStart = R.id.image1;
            params.endToEnd = -1;
            constraintLayout.requestLayout();
        }


    }

    /**
     * Initialize the dataset of the Adapter.
     *
     * @param dataSet String[] containing the data to populate views to be used
     * by RecyclerView.
     */
    public ChatAdapter(ModelMessage[] dataSet, String userid, boolean status) {
        localDataSet = dataSet;
        this.userid = userid;
        this.status = status;

    }

    // Create new views (invoked by the layout manager)
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int viewType) {
        // Create a new view, which defines the UI of the list item
        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.layout_message, viewGroup, false);

        return new ViewHolder(view);
    }

    // Replace the contents of a view (invoked by the layout manager)
    @SuppressLint("ResourceType")
    @Override
    public void onBindViewHolder(ViewHolder viewHolder, final int position) {

        // Get element from your dataset at this position and replace the
        // contents of the view with that element
        if (localDataSet[position].getSenderid().equals(userid)){
            viewHolder.setlayout();
            viewHolder.getTextViewcontent().setText(localDataSet[position].getContent());
            viewHolder.getImageView().setImageResource(0);
            viewHolder.getTextViewcontent().setBackgroundResource(R.drawable.border_massage2);
        }
        else   {
            viewHolder.setlayout1();
            viewHolder.getTextViewcontent().setBackgroundResource(R.drawable.border_massage);
            if (status== false)
                viewHolder.getImageView().setImageResource(R.drawable.bot_drawable);
            else viewHolder.getImageView().setImageResource(R.drawable.person_account_drawable);
            viewHolder.getTextViewcontent().setText(localDataSet[position].getContent());
        }


    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return localDataSet.length;
    }
}

