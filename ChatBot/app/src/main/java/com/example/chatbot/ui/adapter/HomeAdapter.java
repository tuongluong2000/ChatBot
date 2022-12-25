package com.example.chatbot.ui.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.example.chatbot.R;
import com.example.chatbot.model.ModelContext;
import com.example.chatbot.ui.common.OnItemClickListener;

public class HomeAdapter extends RecyclerView.Adapter<HomeAdapter.ViewHolder> {

    private ModelContext[] localDataSet;
    private static OnItemClickListener<ModelContext> onclickListener;
    private static OnItemClickListener<ModelContext> ondelete;

    /**
     * Provide a reference to the type of views that you are using
     * (custom ViewHolder).
     */
    public static class ViewHolder extends RecyclerView.ViewHolder {
        private final TextView textViewcontent;
        private final TextView textViewname;
        private final ImageView imageView;
        private final View viewitem;
        private final ImageButton imageButton;

        public ViewHolder(View view) {
            super(view);
            // Define click listener for the ViewHolder's View

            textViewcontent = view.findViewById(R.id.textview_content_room);
            textViewname = view.findViewById(R.id.textview_name_room);
            imageView = view.findViewById(R.id.imageAVT);
            imageButton = view.findViewById(R.id.button_delete);
            viewitem= view;
        }

        public TextView getTextViewcontent() {
            return textViewcontent;
        }
        public TextView getTextViewname() {
            return textViewname;
        }
        public ImageView getImageView(){return imageView;}
        public ImageButton getImageButton(){return imageButton;}

        private void clickItem(ModelContext item)
        {
            viewitem.setOnClickListener(view ->  onclickListener.onItemClicked(view, item));
        }
        private void clickDelete(ModelContext item){
            imageButton.setOnClickListener(view -> ondelete.onItemClicked(view, item));
        }
    }

    /**
     * Initialize the dataset of the Adapter.
     *
     * @param dataSet String[] containing the data to populate views to be used
     * by RecyclerView.
     */
    public HomeAdapter(ModelContext[] dataSet, OnItemClickListener<ModelContext> onClickListener,OnItemClickListener<ModelContext> onDelete) {
        localDataSet = dataSet;
        this.onclickListener = onClickListener;
        this.ondelete = onDelete;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public ViewHolder onCreateViewHolder(ViewGroup viewGroup, int viewType) {
        // Create a new view, which defines the UI of the list item
        View view = LayoutInflater.from(viewGroup.getContext())
                .inflate(R.layout.layout_room_item, viewGroup, false);

        return new ViewHolder(view);
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(ViewHolder viewHolder, final int position) {

        // Get element from your dataset at this position and replace the
        // contents of the view with that element
        if(localDataSet[position].getAdminid().equals("")){
            viewHolder.getTextViewcontent().setText("chat bot");
            viewHolder.getTextViewname().setText("Bot");
            viewHolder.getImageView().setImageResource(R.drawable.bot_drawable);
        }
        else {
            viewHolder.getTextViewcontent().setText("chat admin");
            viewHolder.getTextViewname().setText("Admin");
            viewHolder.getImageView().setImageResource(R.drawable.person_account_drawable);
        }
        viewHolder.clickItem(localDataSet[position]);
        viewHolder.clickDelete(localDataSet[position]);

    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return localDataSet.length;
    }
}

