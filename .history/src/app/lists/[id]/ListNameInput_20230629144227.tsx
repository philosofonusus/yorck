"use client";

interface ListNameInputProps {
  initialListName: string;
  listId: string;
}

export const ListNameInput: React.FC<ListNameInputProps> = ({ initialListName, listId }) => {
    const [listName, setListName] = useState(initialListName);
    return (
        
    )
};
