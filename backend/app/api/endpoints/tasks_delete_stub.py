@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    # current_user: User = Depends(deps.allow_delete), # OLD
    current_user: User = Depends(deps.get_current_active_user), # Just check login
):
    # Global Delete Ban per requirements
    raise HTTPException(status_code=403, detail="Deleting tasks is globally disabled.")
