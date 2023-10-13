/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';

import classNames from 'classnames';

import './TodoItem.scss';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';

type Props = {
  item: Todo,
};

export const TodoItem: React.FC<Props> = ({ item }) => {
  const { dispatch } = useContext(TodosContext);
  const editRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTodoTitle, setEditedTodoTitle] = useState(item.title);

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
    }
  }, [isEditing]);

  const handleCompletedClick = () => dispatch({
    type: 'toggle',
    payload: item,
  });

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleRemoveItem = () => dispatch({
    type: 'remove',
    payload: item.id,
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTodoTitle(event.target.value);
  };

  const saveChanges = () => {
    if (editedTodoTitle.trim().length !== 0) {
      dispatch({
        type: 'edit',
        payload: item,
      });
    } else {
      handleRemoveItem();
    }

    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTodoTitle(item.title);
      setIsEditing(false);
    }

    if (event.key === 'Enter') {
      saveChanges();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: item.completed,
      })}
    >
      <label
        className="todo__status-label"
        onDoubleClick={handleDoubleClick}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={item.completed}
          onClick={handleCompletedClick}
        />
      </label>

      {!isEditing ? (
        <>
          {/* Todo is being saved now */}
          <span data-cy="TodoTitle" className="todo__title">
            {item.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemoveItem}
          >
            ×
          </button>
        </>
      ) : (
        <input
          data-cy="TodoTitleField"
          ref={editRef}
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTodoTitle}
          onChange={handleTitleChange}
          onKeyUp={handleKeyUp}
          onBlur={saveChanges}
        />
      )}

      {/* 'is-active' */}
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
